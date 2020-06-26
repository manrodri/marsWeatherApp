# Mars Weather App

This repository contains a simple website that gathers and displays Mars weather data. The data is fetched from
the publicly available NASA [API](https://api.nasa.gov/insight_weather).

The website uses vanilla JS, HTML and CSS.

Continuous Deployment is done using AWS CodePipeline, I also included in the repository:
* A CloudFormation template that creates a S3 bucket to host the website.
* The builspec.yml file used in the build stage (as I didn't want to include the devops files in the hosting bucket I used codebuild rather 
than deploy directly to S3)
* The IAM policy that gives code build permissions to write the S3 bucket


Find the result in this [url](http://websitebucket-s3bucket-197tafz5f80ok.s3-website-eu-west-1.amazonaws.com/)