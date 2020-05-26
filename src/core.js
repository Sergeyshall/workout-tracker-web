const authorization = 'dummy-token';

const getByUri = async (uri) => {
    const params = {
        method: 'GET',
        headers: {
            Authorization: authorization,
        }
    };

    return fetch(uri, params)
        .then((response) => {
            if (response.status !== 200) {
                throw response;
            }

            return response.json();
        });
};

const getExercises = async () => {
    const uri = "/data/exercises.json";

    return getByUri(uri);
};

const getWorkouts = async () => {
    const uri = "/data/workouts.json";

    return getByUri(uri);
};

const getWorkoutsWithExercises = async () => {
    const exercises = await getExercises();
    const workouts = await getWorkouts();

    return workouts.map(workout => {
        workout.exercises = workout.exercises.map(exercise => {
            return exercises.find(item => item.name === exercise);
        });

        return workout;
    })
};

export {
    getExercises,
    getWorkouts,
    getWorkoutsWithExercises,
}
