import React, { useState, useEffect } from 'react';

interface User {
  name: string;
  gymMembership: boolean;
  workoutCount: number;
}

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = ({ title = "Billy's Gym App" }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newUserName, setNewUserName] = useState<string>('');

  useEffect(() => {
    // Simulate fetching gym members
    const fetchUsers = async (): Promise<User[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { name: 'Billy Herrington', gymMembership: true, workoutCount: 1000 },
            { name: 'Van Darkholme', gymMembership: true, workoutCount: 750 },
            { name: 'Danny Lee', gymMembership: true, workoutCount: 500 }
          ]);
        }, 1000);
      });
    };

    fetchUsers()
      .then((userData) => {
        setUsers(userData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch gym members:', error);
        setLoading(false);
      });
  }, []);

  const addUser = () => {
    if (newUserName.trim()) {
      const newUser: User = {
        name: newUserName.trim(),
        gymMembership: true,
        workoutCount: 0
      };
      setUsers([...users, newUser]);
      setNewUserName('');
    }
  };

  const incrementWorkout = (index: number) => {
    setUsers(users.map((user, i) => 
      i === index 
        ? { ...user, workoutCount: user.workoutCount + 1 }
        : user
    ));
  };

  if (loading) {
    return (
      <div className="app">
        <h1>{title}</h1>
        <p>Loading gym members... 💪</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>{title}</h1>
        <p>Welcome to the deepest, darkest gym fantasy! 🏋️‍♂️</p>
      </header>
      
      <section>
        <h2>Gym Members</h2>
        <div className="user-list">
          {users.map((user, index) => (
            <div key={user.name} className="user-card">
              <h3>{user.name}</h3>
              <p>Membership: {user.gymMembership ? '✅ Active' : '❌ Inactive'}</p>
              <p>Workouts: {user.workoutCount}</p>
              <button onClick={() => incrementWorkout(index)}>
                Add Workout 💪
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Add New Member</h2>
        <div className="add-user">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter gym member name"
            onKeyPress={(e) => e.key === 'Enter' && addUser()}
          />
          <button onClick={addUser}>
            Join the Gym 🏋️
          </button>
        </div>
      </section>

      <footer>
        <p>💪 "You gotta work out to be the boss of this gym!" - Billy Herrington</p>
      </footer>
    </div>
  );
};

export default App;