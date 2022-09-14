import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Construct } from 'constructs';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const allowMetrics = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: ['cloudwatch:PutMetricData'],
        }),
      ],
    });

    const myRole = new iam.Role(this, 'DemoRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        AllowMetrics: allowMetrics,
      },
    });

    const fn = new lambda.Function(this, 'DemoFunction', {
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'sample-lambda.sample_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../sample_lambda')),
      role: myRole,
    });
  }
}
