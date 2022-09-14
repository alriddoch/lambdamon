import boto3
from datetime import datetime

def sample_handler(event, context):
  client = boto3.client('cloudwatch')
  response = client.put_metric_data(
    Namespace='DemoNamespace',
    MetricData=[
      {
        'MetricName': 'DemoMetricName',
        'Dimensions': [
          {
            'Name': 'LabelName1',
            'Value': 'LabelValue2',
          },
        ],
        'Timestamp': datetime.now(),
        'Value': 123.0,
      },
    ]
  )
  print("Lambda Skylab test function: ", response)
