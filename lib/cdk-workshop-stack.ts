import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Construct } from 'constructs';

export interface WorkshopProps extends StackProps {
  workspaceId: string,
}

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props: WorkshopProps) {
    super(scope, id, props);

    const allowMetrics = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: [
            'aps:RemoteWrite',
            'cloudwatch:PutMetricData'
          ],
        }),
      ],
    });

    const myRole = new iam.Role(this, 'DemoRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        AllowMetrics: allowMetrics,
      },
    });

    const adotLayer = lambda.LayerVersion.fromLayerVersionArn(this, "adotLayer", "arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-12-0:1");

    const configLayer = new lambda.LayerVersion(this, 'config-layer', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../config')),
    });

    const fn = new lambda.Function(this, 'DemoFunction', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'sample-lambda.sample_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../sample_lambda')),
      role: myRole,
      layers: [adotLayer, configLayer],
      environment: {
        'OPENTELEMETRY_COLLECTOR_CONFIG_FILE': '/opt/collector.yaml',
      }
    });
  }
}
