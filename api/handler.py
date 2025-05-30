import boto3
import uuid
import time

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('posts')

# New post data
post_item = {
    'id': str(uuid.uuid4()),
    'user': "elden",
    'title': 'My First Post',
    'content': 'This is the content of the post.',
    'timestamp': int(time.time())
}

def lambda_handler(event, context):
    # Write to DynamoDB
    response = table.put_item(Item=post_item)

    print("Post added:", response)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        "body": "Hello from Lambda!"
    }