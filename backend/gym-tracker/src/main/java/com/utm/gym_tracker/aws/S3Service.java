package com.utm.gym_tracker.aws;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.Instant;
import java.util.Date;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 s3client;

    @Value("${app.awsBucket}")
    private String bucketName;

    /**
     * Generates a presigned URL for a GET request to access an object.
     * @param objectKey the key of the object in S3.
     * @return a presigned URL as a String.
     */
    public String generatePresignedGet(String objectKey) {
        // Set expiration for the presigned URL (e.g., valid for 10 minutes)
        Instant expirationTime = Instant.now().plusSeconds(600);
        Date expiration = Date.from(expirationTime);

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, objectKey)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration);

        URL url = s3client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }
}
