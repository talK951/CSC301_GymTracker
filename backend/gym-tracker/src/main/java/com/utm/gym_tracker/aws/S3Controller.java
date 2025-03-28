package com.utm.gym_tracker.aws;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.utm.gym_tracker.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.UUID;

@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    @Autowired
    private AmazonS3 s3client;

    @Value("${app.awsBucket}")
    private String bucketName;

    // DTO for request payload
    public static class PresignRequest {
        private String fileName;
        private String contentType;

        public String getFileName() {
            return fileName;
        }
        public void setFileName(String fileName) {
            this.fileName = fileName;
        }
        public String getContentType() {
            return contentType;
        }
        public void setContentType(String contentType) {
            this.contentType = contentType;
        }
    }

    // DTO for response payload
    public static class PresignResponse {
        private String presignedUrl;
        private String s3ObjectKey;

        public PresignResponse(String presignedUrl, String s3ObjectKey) {
            this.presignedUrl = presignedUrl;
            this.s3ObjectKey = s3ObjectKey;
        }

        public String getPresignedUrl() {
            return presignedUrl;
        }
        public void setPresignedUrl(String presignedUrl) {
            this.presignedUrl = presignedUrl;
        }
        public String getS3ObjectKey() {
            return s3ObjectKey;
        }
        public void setS3ObjectKey(String s3ObjectKey) {
            this.s3ObjectKey = s3ObjectKey;
        }
    }

    @PostMapping("/presign-upload")
    public ResponseEntity<ApiResponse<PresignResponse>> generatePresignedUrl(@RequestBody PresignRequest request) {
        try {
            String uniqueKey = UUID.randomUUID().toString() + "_" + request.getFileName();

            GeneratePresignedUrlRequest generatePresignedUrlRequest =
                    new GeneratePresignedUrlRequest(bucketName, uniqueKey)
                            .withMethod(HttpMethod.PUT);

            URL url = s3client.generatePresignedUrl(generatePresignedUrlRequest);
            PresignResponse presignResponse = new PresignResponse(url.toString(), uniqueKey);
            ApiResponse<PresignResponse> response = new ApiResponse<>("Success", presignResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
