#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';
import { AmpStack } from '../lib/amp-stack';

const app = new cdk.App();
const amp = new AmpStack(app, 'AmpStack');

const lambda = new CdkWorkshopStack(app, 'CdkWorkshopStack', {
  workspaceId: amp.workspaceId,
});

lambda.addDependency(amp)
