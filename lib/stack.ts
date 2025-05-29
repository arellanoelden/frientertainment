import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export class MyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🪣 S3 bucket for the frontend
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 🚀 Deploy React build to S3
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, "..", "website", "build")),
      ],
      destinationBucket: websiteBucket,
    });

    // 🌩️ CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, "CloudFrontDist", {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    // 🧬 Lambda function (Python)
    const apiFunction = new lambda.Function(this, "ApiLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "handler.lambda_handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "api")),
    });

    // 🔌 API Gateway
    const api = new apigateway.LambdaRestApi(this, "ApiGateway", {
      handler: apiFunction,
      proxy: true,
    });

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.domainName}`,
    });

    new cdk.CfnOutput(this, "ApiURL", {
      value: api.url!,
    });
  }
}
