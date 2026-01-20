# functions/main.py

from firebase_functions import storage_fn, https_fn, tasks_fn
from firebase_admin import initialize_app, storage
from google.cloud import tasks_v2
import os
import json
import datetime

# Initialize Firebase Admin SDK (important for Storage and other Firebase services)
initialize_app()

# Get project ID from environment variables
project_id = os.environ.get('GCP_PROJECT')
# Set the region where your Cloud Functions and Cloud Tasks queue will reside
# This should be the same region you selected when initializing your project or deploying functions.
# For your Firestore, you're in asia-south1, but us-central1 is a common default for Functions.
# Choose a region that is close to your users and other services.
# Let's use 'us-central1' as a common example.
location = 'us-central1'

# --- Producer Function: Triggered by Cloud Storage Uploads ---
@storage_fn.on_object_finalized(bucket="your-storage-bucket-name") # IMPORTANT: Replace with your actual Storage bucket name (e.g., arkaiv-e61ba.appspot.com)
def on_document_upload(event: storage_fn.StorageObjectData):
    """
    Cloud Function triggered when a new object is finalized (uploaded) in Cloud Storage.
    It enqueues a Cloud Task to process the uploaded document.
    """
    if not event.name:
        print("No file name found in the event.")
        return

    file_path = event.name
    bucket_name = event.bucket
    print(f"New document uploaded to bucket '{bucket_name}': {file_path}")

    try:
        # Initialize Cloud Tasks client
        client = tasks_v2.CloudTasksClient()

        # Construct the fully qualified queue name.
        # 'document-processing-queue' is the name of the queue that will be created
        # when you deploy the 'process_document_task' function using tasks_fn.on_dispatch.
        queue_name = client.queue_path(project_id, location, 'document-processing-queue')

        # Define the payload for the task. This is what your task function will receive.
        payload = {'filePath': file_path, 'bucket': bucket_name}

        # Create the task
        task = {
            "http_request": {
                "http_method": tasks_v2.HttpMethod.POST,
                "url": f"https://{location}-{project_id}.cloudfunctions.net/process_document_task", # This is the target URL for the task function
                "headers": {"Content-type": "application/json"},
                "body": json.dumps(payload).encode(),
                # For security, Cloud Tasks should invoke your function with an OIDC token.
                # This tells Cloud Tasks to generate and send a token for the default service account.
                "oidc_token": {
                    "service_account_email": f"{project_id}@appspot.gserviceaccount.com",
                    "audience": f"https://{location}-{project_id}.cloudfunctions.net/process_document_task"
                }
            }
        }

        # Enqueue the task
        response = client.create_task(request={"parent": queue_name, "task": task})
        print(f"Successfully enqueued Cloud Task: {response.name}")

    except Exception as e:
        print(f"Error enqueuing Cloud Task for {file_path}: {e}")
        raise # Re-raise the exception to indicate a failure

    return "Cloud Task enqueued successfully!"

# --- Consumer Function: Triggered by Cloud Task ---
@tasks_fn.on_dispatch(queue="document-processing-queue", retry_config=tasks_fn.RetryConfig(max_attempts=5, min_backoff_seconds=60))
def process_document_task(req: tasks_fn.CallableRequest):
    """
    Cloud Function that is invoked by a Cloud Task. It processes the document.
    """
    data = req.data
    file_path = data.get('filePath')
    bucket_name = data.get('bucket')

    if not file_path or not bucket_name:
        print("Missing 'filePath' or 'bucket' in task payload.")
        raise ValueError("Invalid task payload received.")

    print(f"Task received: Processing document '{file_path}' from bucket '{bucket_name}'")

    try:
        # Get a reference to the Firebase Storage bucket
        bucket = storage.bucket(bucket_name)
        blob = bucket.blob(file_path)

        # --- YOUR DOCUMENT PROCESSING LOGIC GOES HERE ---
        # Example: Download the file and print its first few lines
        content = blob.download_as_text() # Use download_as_bytes() for binary files
        print(f"Content of '{file_path}' (first 200 chars):\n{content[:200]}...")

        # You can perform various operations here:
        # - Analyze image/video content with Google Cloud Vision/Video AI
        # - Extract text from PDFs/images
        # - Transcode media files
        # - Update a Firestore document with processing results
        # - Trigger further chained tasks

        print(f"Successfully processed document: {file_path}")
        return {"status": "success", "message": f"Processed {file_path}"}

    except Exception as e:
        print(f"Error during document processing for '{file_path}': {e}")
        # Raising an exception here tells Cloud Tasks to retry the task
        # based on the retry_config defined in @tasks_fn.on_dispatch.
        raise # Re-raise the exception to signal failure and trigger retry