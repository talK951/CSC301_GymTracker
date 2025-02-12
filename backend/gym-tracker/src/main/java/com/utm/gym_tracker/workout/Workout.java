package com.utm.gym_tracker.workout;

import java.time.LocalDateTime;

// import org.springframework.cglib.core.Local;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.utm.gym_tracker.user.User;
import jakarta.validation.constraints.Min;

import jakarta.persistence.*;

@Entity
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties("workouts")
    private User user;

    @Column(nullable = false)
    private String exercise;

    @Column(nullable = false)
    private Integer sets;

    @Column(nullable = false)
    @Min(0)
    private Double weight;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Workout() {}

    public Workout(User user, String exercise, Integer sets, Double weight, LocalDateTime starTime, LocalDateTime endTime) {
        this.user = user;
        this.exercise = exercise;
        this.sets = sets;
        this.weight = weight;
        this.startTime = starTime;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getExercise() {
        return exercise;
    }

    public void setExercise(String exercise) {
        this.exercise = exercise;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    @Override
    public String toString() {
        return "Workout{" +
                "id=" + id +
                ", exercise='" + exercise + '\'' +
                ", sets=" + sets +
                ", weight=" + weight +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", user=" + user.getID() +
                '}';
    }
}
