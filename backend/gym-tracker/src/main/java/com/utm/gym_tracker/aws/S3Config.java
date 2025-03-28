package com.utm.gym_tracker.aws;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    @Value("${app.awsAccessKey}")
    private String awsKey;

    @Value("${app.awsSecret}")
    private String awsSecret;

    @Value("${app.awsRegion}")
    private String awsRegion;

    @Bean
    public AmazonS3 s3client() {
        BasicAWSCredentials creds = new BasicAWSCredentials(awsKey, awsSecret);
        return AmazonS3ClientBuilder.standard()
                .withRegion(awsRegion)
                .withCredentials(new AWSStaticCredentialsProvider(creds))
                .build();
    }
}
