import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as aps from 'aws-cdk-lib/aws-aps';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Construct } from 'constructs';

export class AmpStack extends Stack {
  public workspaceId: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cfnWorkspace = new aps.CfnWorkspace(this, 'DemoWorkspace', /* all optional props */ {
      alias: 'prometheus-demo-recipe',
      tags: [{
        key: 'team',
        value: 'Demo',
      }],
    });

    this.workspaceId = cfnWorkspace.attrWorkspaceId;
  }
}
