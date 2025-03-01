import React, { useState, useEffect } from 'react';

const WorkoutTracker = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });
  const [benchmarks, setBenchmarks] = useState(() => {
    const savedBenchmarks = localStorage.getItem('benchmarks');
    return savedBenchmarks ? JSON.parse(savedBenchmarks) : {
      pushups: { start: 20, current: 20 },
      pullups: { start: 8, current: 8 },
      squat: { start: 0, current: 0 },
      weight: { start: 190, current: 190 }
    };
  });
  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    day: getDayName(new Date().getDay()),
    type: getWorkoutTypeForDay(new Date().getDay()),
    exercises: []
  });
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  });

  // Templates for workout days
  const workoutTemplates = {
    'Monday': {
      type: 'Lower Body Focus + Core',
      exercises: [
        { name: 'Main Squat', sets: 4, reps: 8, weight: '', notes: '' },
        { name: 'KB Romanian DL', sets: 3, reps: 10, weight: '', notes: '' },
        { name: 'Reverse Lunges', sets: 3, reps: 8, weight: '', notes: '' },
        { name: 'KB Step-ups', sets: 3, reps: 8, weight: '', notes: '' },
        { name: 'Hanging Knee Raises', sets: 3, reps: 10, weight: '', notes: '' },
        { name: 'Plank', sets: 3, reps: '30s', weight: '', notes: '' },
        { name: 'Russian Twists', sets: 3, reps: 15, weight: '', notes: '' }
      ]
    },
    'Tuesday': {
      type: 'Gym Climbing Session',
      exercises: [
        { name: 'Warm-up', sets: '', reps: '', weight: '', notes: '' },
        { name: 'Main Session', sets: '', reps: '', weight: '', notes: '' },
        { name: 'Projects', sets: '', reps: '', weight: '', notes: '' }
      ]
    },
    'Wednesday': {
      type: 'Upper Body (Push emphasis)',
      exercises: [
        { name: 'Ring Push-ups', sets: 4, reps: 12, weight: '', notes: '' },
        { name: 'Overhead Press', sets: 3, reps: 8, weight: '', notes: '' },
        { name: 'Ring/Bench Dips', sets: 3, reps: 10, weight: '', notes: '' },
        { name: 'DB Lateral Raises', sets: 3, reps: 12, weight: '', notes: '' },
        { name: 'Face Pulls', sets: 3, reps: 15, weight: '', notes: '' },
        { name: 'KB Halos', sets: 3, reps: 8, weight: '', notes: '' },
        { name: 'Ring External Rotations', sets: 3, reps: 12, weight: '', notes: '' }
      ]
    },
    'Thursday': {
      type: 'Gym Climbing Session',
      exercises: [
        { name: 'Warm-up', sets: '', reps: '', weight: '', notes: '' },
        { name: 'Main Session', sets: '', reps: '', weight: '', notes: '' },
        { name: 'Projects', sets: '', reps: '', weight: '', notes: '' }
      ]
    },
    'Friday': {
      type: 'Full Body Circuit',
      exercises: [
        { name: 'KB Swings', sets: 3, reps: 12, weight: '', notes: '' },
        { name: 'Goblet Squats', sets: 3, reps: 12, weight: '', notes: '' },
        { name: 'Push-ups', sets: 3, reps: 12, weight: '', notes: '' },
        { name: 'Med Ball Slams', sets: 3, reps: 10, weight: '', notes: '' },
        { name: 'Step-ups', sets: 3, reps: 10, weight: '', notes: '' },
        { name: 'Mountain Climbers', sets: 3, reps: 20, weight: '', notes: '' },
        { name: 'Jump Rope Finisher', sets: 1, reps: '5 min', weight: '', notes: '' }
      ]
    }
  };

  // Helper functions
  function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }

  function getWorkoutTypeForDay(dayIndex) {
    const day = getDayName(dayIndex);
    // Default values for each day
    const defaultTypes = {
      'Monday': 'Lower Body Focus + Core',
      'Tuesday': 'Gym Climbing Session',
      'Wednesday': 'Upper Body (Push emphasis)',
      'Thursday': 'Gym Climbing Session',
      'Friday': 'Full Body Circuit',
      'Saturday': 'Rest Day',
      'Sunday': 'Rest Day'
    };
    return defaultTypes[day] || 'Rest Day';
  }

  // Save to localStorage whenever workouts or benchmarks change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('benchmarks', JSON.stringify(benchmarks));
  }, [benchmarks]);

  // Load template for the selected day
  useEffect(() => {
    const dayTemplate = workoutTemplates[newWorkout.day];
    if (dayTemplate) {
      setNewWorkout(prev => ({
        ...prev,
        type: dayTemplate.type,
        exercises: dayTemplate.exercises.map(ex => ({ ...ex }))
      }));
    } else {
      setNewWorkout(prev => ({
        ...prev,
        type: 'Rest Day',
        exercises: []
      }));
    }
  }, [newWorkout.day]);

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDayChange = (e) => {
    setNewWorkout(prev => ({
      ...prev,
      day: e.target.value
    }));
  };

  const handleDateChange = (e) => {
    setNewWorkout(prev => ({
      ...prev,
      date: e.target.value
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    setNewWorkout(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value
      };
      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };

  const handleSaveWorkout = () => {
    const workoutToSave = {
      ...newWorkout,
      id: Date.now()
    };
    setWorkouts(prev => [workoutToSave, ...prev]);
    alert('Workout saved successfully!');
  };

  const handleUpdateBenchmark = (metric, value) => {
    setBenchmarks(prev => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        current: parseInt(value) || 0
      }
    }));
  };

  // Components
  const Dashboard = () => {
    const calculateChange = (start, current) => {
      return current - start;
    };

    const calculatePercentage = (start, current) => {
      if (start === 0) return '0%';
      return `${Math.round((current - start) / start * 100)}%`;
    };

    const recentWorkouts = workouts.slice(0, 5);

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
          <h3 className="font-semibold text-lg mb-2">Progress Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 text-left">Metric</th>
                  <th className="p-2 text-right">Starting</th>
                  <th className="p-2 text-right">Current</th>
                  <th className="p-2 text-right">Change</th>
                  <th className="p-2 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Push-ups (max)</td>
                  <td className="p-2 text-right">{benchmarks.pushups.start}</td>
                  <td className="p-2 text-right">{benchmarks.pushups.current}</td>
                  <td className="p-2 text-right">{calculateChange(benchmarks.pushups.start, benchmarks.pushups.current)}</td>
                  <td className="p-2 text-right">{calculatePercentage(benchmarks.pushups.start, benchmarks.pushups.current)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Pull-ups (max)</td>
                  <td className="p-2 text-right">{benchmarks.pullups.start}</td>
                  <td className="p-2 text-right">{benchmarks.pullups.current}</td>
                  <td className="p-2 text-right">{calculateChange(benchmarks.pullups.start, benchmarks.pullups.current)}</td>
                  <td className="p-2 text-right">{calculatePercentage(benchmarks.pullups.start, benchmarks.pullups.current)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Squat 5RM</td>
                  <td className="p-2 text-right">{benchmarks.squat.start}</td>
                  <td className="p-2 text-right">{benchmarks.squat.current}</td>
                  <td className="p-2 text-right">{calculateChange(benchmarks.squat.start, benchmarks.squat.current)}</td>
                  <td className="p-2 text-right">{calculatePercentage(benchmarks.squat.start, benchmarks.squat.current)}</td>
                </tr>
                <tr>
                  <td className="p-2">Weight (lbs)</td>
                  <td className="p-2 text-right">{benchmarks.weight.start}</td>
                  <td className="p-2 text-right">{benchmarks.weight.current}</td>
                  <td className="p-2 text-right">{calculateChange(benchmarks.weight.start, benchmarks.weight.current)}</td>
                  <td className="p-2 text-right">{calculatePercentage(benchmarks.weight.start, benchmarks.weight.current)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg shadow mb-6">
          <h3 className="font-semibold text-lg mb-2">Recent Workouts</h3>
          {recentWorkouts.length === 0 ? (
            <p className="text-gray-500 italic">No workouts logged yet.</p>
          ) : (
            <div>
              {recentWorkouts.map(workout => (
                <div key={workout.id} className="mb-2 p-2 bg-white rounded border">
                  <div className="flex justify-between">
                    <span className="font-medium">{workout.date} ({workout.day})</span>
                    <span className="text-blue-600">{workout.type}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {workout.exercises.length} exercises
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Weekly Schedule</h3>
            <ul className="list-disc pl-5">
              <li className="mb-1"><span className="font-medium">Monday:</span> Lower Body Focus + Core</li>
              <li className="mb-1"><span className="font-medium">Tuesday:</span> Gym Climbing Session</li>
              <li className="mb-1"><span className="font-medium">Wednesday:</span> Upper Body (Push emphasis)</li>
              <li className="mb-1"><span className="font-medium">Thursday:</span> Gym Climbing Session</li>
              <li className="mb-1"><span className="font-medium">Friday:</span> Full Body Circuit</li>
              <li className="mb-1"><span className="font-medium">Weekend:</span> Rest/Outdoor Activities</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Squat Progression Plan</h3>
            <ul className="list-disc pl-5">
              <li className="mb-1"><span className="font-medium">Weeks 1-2:</span> Goblet squats (4×10)</li>
              <li className="mb-1"><span className="font-medium">Weeks 3-4:</span> Front squats (4×8)</li>
              <li className="mb-1"><span className="font-medium">Weeks 5-6:</span> Back squats (4×6-8)</li>
              <li className="mb-1"><span className="font-medium">Weeks 7-8:</span> Deload and restart cycle</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const LogWorkout = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Log Workout</h2>
        
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input 
                type="date"
                value={newWorkout.date}
                onChange={handleDateChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Day</label>
              <select 
                value={newWorkout.day}
                onChange={handleDayChange}
                className="w-full p-2 border rounded"
              >
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Workout Type</label>
              <input 
                type="text"
                value={newWorkout.type}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 mt-4">Exercises</h3>
          
          {newWorkout.exercises.length === 0 ? (
            <div className="italic text-gray-500 mb-4">
              No exercises for this day. Choose a different day or add exercises manually.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Exercise</th>
                    <th className="p-2 text-center">Sets</th>
                    <th className="p-2 text-center">Reps</th>
                    <th className="p-2 text-center">Weight</th>
                    <th className="p-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {newWorkout.exercises.map((exercise, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        {exercise.name}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                          className="w-full p-1 border rounded text-center"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                          className="w-full p-1 border rounded text-center"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={exercise.weight}
                          onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                          className="w-full p-1 border rounded text-center"
                          placeholder="lbs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={exercise.notes}
                          onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                          className="w-full p-1 border rounded"
                          placeholder="Notes"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              {newWorkout.exercises.length} exercises
            </div>
            <button 
              onClick={handleSaveWorkout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Workout
            </button>
          </div>
        </div>
      </div>
    );
  };

  const History = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Workout History</h2>
        
        {workouts.length === 0 ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 italic">No workouts logged yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map(workout => (
              <div key={workout.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">{workout.date} ({workout.day})</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {workout.type}
                  </span>
                </div>
                
                <table className="w-full mb-2">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">Exercise</th>
                      <th className="p-2 text-center">Sets</th>
                      <th className="p-2 text-center">Reps</th>
                      <th className="p-2 text-center">Weight</th>
                      <th className="p-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workout.exercises.map((exercise, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{exercise.name}</td>
                        <td className="p-2 text-center">{exercise.sets}</td>
                        <td className="p-2 text-center">{exercise.reps}</td>
                        <td className="p-2 text-center">{exercise.weight}</td>
                        <td className="p-2">{exercise.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const Progress = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Progress Tracking</h2>
        
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-semibold text-lg mb-3">Update Benchmarks</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Push-ups (max)</label>
              <input 
                type="number"
                value={benchmarks.pushups.current}
                onChange={(e) => handleUpdateBenchmark('pushups', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Pull-ups (max)</label>
              <input 
                type="number"
                value={benchmarks.pullups.current}
                onChange={(e) => handleUpdateBenchmark('pullups', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Squat 5RM (lbs)</label>
              <input 
                type="number"
                value={benchmarks.squat.current}
                onChange={(e) => handleUpdateBenchmark('squat', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Body Weight (lbs)</label>
              <input 
                type="number"
                value={benchmarks.weight.current}
                onChange={(e) => handleUpdateBenchmark('weight', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-3">Starting Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Push-ups (max)</label>
              <input 
                type="number"
                value={benchmarks.pushups.start}
                onChange={(e) => setBenchmarks(prev => ({
                  ...prev,
                  pushups: { ...prev.pushups, start: parseInt(e.target.value) || 0 }
                }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Pull-ups (max)</label>
              <input 
                type="number"
                value={benchmarks.pullups.start}
                onChange={(e) => setBenchmarks(prev => ({
                  ...prev,
                  pullups: { ...prev.pullups, start: parseInt(e.target.value) || 0 }
                }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Squat 5RM (lbs)</label>
              <input 
                type="number"
                value={benchmarks.squat.start}
                onChange={(e) => setBenchmarks(prev => ({
                  ...prev,
                  squat: { ...prev.squat, start: parseInt(e.target.value) || 0 }
                }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Body Weight (lbs)</label>
              <input 
                type="number"
                value={benchmarks.weight.start}
                onChange={(e) => setBenchmarks(prev => ({
                  ...prev,
                  weight: { ...prev.weight, start: parseInt(e.target.value) || 0 }
                }))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Mountain Sports Workout Tracker</h1>
      </header>
      
      <div className="flex overflow-hidden flex-1">
        <nav className="bg-gray-800 text-white w-full md:w-64 flex-shrink-0">
          <div className="flex md:block overflow-x-auto md:overflow-visible">
            <button 
              onClick={() => handleTabChange('dashboard')}
              className={`block w-full text-left p-4 hover:bg-gray-700 ${activeTab === 'dashboard' ? 'bg-gray-700' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => handleTabChange('log')}
              className={`block w-full text-left p-4 hover:bg-gray-700 ${activeTab === 'log' ? 'bg-gray-700' : ''}`}
            >
              Log Workout
            </button>
            <button 
              onClick={() => handleTabChange('history')}
              className={`block w-full text-left p-4 hover:bg-gray-700 ${activeTab === 'history' ? 'bg-gray-700' : ''}`}
            >
              Workout History
            </button>
            <button 
              onClick={() => handleTabChange('progress')}
              className={`block w-full text-left p-4 hover:bg-gray-700 ${activeTab === 'progress' ? 'bg-gray-700' : ''}`}
            >
              Progress Tracking
            </button>
          </div>
        </nav>
        
        <main className="flex-1 overflow-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'log' && <LogWorkout />}
          {activeTab === 'history' && <History />}
          {activeTab === 'progress' && <Progress />}
        </main>
      </div>
    </div>
  );
};

export default WorkoutTracker;