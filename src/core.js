const getByUri = async (uri) => {
    const response = await fetch(uri);
    if (response.status !== 200) {
        throw new Error(`Failed to fetch ${uri}: ${response.status}`);
    }
    return response.json();
};

const getExercises = async () => {
    return getByUri("/data/exercises.json");
};

const getWorkouts = async () => {
    return getByUri("/data/workouts.json");
};

const getWorkoutsWithExercises = async () => {
    const exercises = await getExercises();
    const workouts = await getWorkouts();

    return workouts.map((workout) => ({
        ...workout,
        exercises: workout.exercises.map((exerciseName) =>
            exercises.find((item) => item.name === exerciseName)
        ),
    }));
};

export { getExercises, getWorkouts, getWorkoutsWithExercises };
