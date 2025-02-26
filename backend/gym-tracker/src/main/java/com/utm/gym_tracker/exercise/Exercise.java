package com.utm.gym_tracker.exercise;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.utm.gym_tracker.workout.Workout;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    @JsonIgnoreProperties("exercises")
    private Workout workout;

    @Column(nullable = false)
    private String exercise;

    @Column(nullable = false)
    private Integer sets;

    @Column(nullable = false)
    @Min(0)
    private Integer reps;

    @Column(nullable = false)
    @Min(0)
    private Double weight;

    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Exercise() {}

    public Exercise(Workout workout, String exercise, Integer sets, Integer reps, Double weight) {
        this.workout = workout;
        this.exercise = exercise;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Workout getWorkout() {
        return workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
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

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public String toString() {
        return "Exercise{" +
                "id=" + id +
                ", workoutId=" + (workout != null ? workout.getId() : null) +
                ", exercise='" + exercise + '\'' +
                ", sets=" + sets +
                ", reps=" + reps +
                ", weight=" + weight +
                ", createdAt=" + createdAt +
                '}';
    }
}
