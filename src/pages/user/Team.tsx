import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getReferralTree, addUser, getUsersByIds } from '@/services/api';
import type { User } from '@/types';

interface TeamMember {
  id: string;
  name: string;
  uniqueId: string;
  createdAt: string | Date;
}

const UserTeam: React.FC = () => {
  const { user } = useAuth();
  const [teamData, setTeamData] = useState<{ level: number; users: TeamMember[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [adding, setAdding] = useState(false);

  const fetchTeamData = async () => {
    if (!user?.uniqueId) return;
    setLoading(true);

    try {
      const referrals = await getReferralTree(user.uniqueId);
      const refereeIds = referrals.map(r => r.refereeId);
      const allUsers: User[] = await getUsersByIds(refereeIds);

      const grouped = referrals.reduce((acc, referral) => {
        const foundUser = allUsers.find(u => u.uniqueId === referral.refereeId);
        if (!foundUser) return acc;

        const levelGroup = acc.find(group => group.level === referral.level);
        const userWithFormattedDate = {
          id: foundUser._id || foundUser.uniqueId,
          name: foundUser.name,
          uniqueId: foundUser.uniqueId,
          createdAt:
            foundUser.createdAt instanceof Date
              ? foundUser.createdAt.toISOString()
              : foundUser.createdAt,
        };

        if (levelGroup) {
          levelGroup.users.push(userWithFormattedDate);
        } else {
          acc.push({
            level: referral.level,
            users: [userWithFormattedDate],
          });
        }

        return acc;
      }, [] as { level: number; users: TeamMember[] }[]);
      // if(user)
      setTeamData(grouped.filter(g => g.level >= 1 && g.level <= 5));
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const getTotalMembers = () => {
    return teamData.reduce((total, level) => total + level.users.length, 0);
  };

  const handleAddUser = async () => {
    setAdding(true);
    try {
      await addUser({
        name: formData.name,
        email: formData.email,
        password: '',
        referrerId: user?.uniqueId || '',
      });
      setFormData({ name: '', email: '' });
      setShowAddModal(false);
      await fetchTeamData();
    } catch (err) {
      console.error('Add user failed:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Team</h1>
          <Button onClick={() => setShowAddModal(true)}>Add User</Button>
        </div> */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users size={20} className="mr-2" />
              Team Overview
            </CardTitle>
            <CardDescription>Manage and monitor your team performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-primary bg-opacity-10 rounded-md">
                <span className="text-sm font-medium">Total Members</span>
                <span className="text-2xl font-bold">{getTotalMembers()}</span>
              </div>
              {teamData.map(level => (
                <div
                  key={level.level}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                  onClick={() => setActiveLevel(level.level)}
                >
                  <span className="text-sm font-medium">Level {level.level}</span>
                  <span className="text-2xl font-bold">{level.users.length}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Level {activeLevel} Team Members</CardTitle>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <Button
                    key={level}
                    variant={activeLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveLevel(level)}
                  >
                    Level {level}
                  </Button>
                ))}
              </div>
            </div>
            <CardDescription>
              {activeLevel === 1
                ? "Direct team members you've personally invited"
                : `Team members at level ${activeLevel} in your network`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teamData.find(level => level.level === activeLevel)?.users.length === 0 ? (
              <div className="text-center py-12">
                <Users size={40} className="mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No Team Members at This Level</h3>
                <p className="text-gray-500 mt-1">
                  {activeLevel === 1
                    ? "You haven't invited any direct team members yet."
                    : `You don't have any level ${activeLevel} team members yet.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 font-medium text-gray-500 px-4 py-2 bg-gray-50 rounded-md">
                  <div>ID</div>
                  <div>Name</div>
                  <div>Date Joined</div>
                </div>

                {teamData
                  .find(level => level.level === activeLevel)
                  ?.users.map(member => (
                    <div
                      key={member.id}
                      className="grid grid-cols-3 px-4 py-3 bg-white border border-gray-100 rounded-md"
                    >
                      <div className="flex items-center">
                        <UserIcon size={16} className="mr-2 text-gray-400" />
                        <span>{member.uniqueId}</span>
                      </div>
                      <div>{member.name}</div>
                      <div className="text-gray-500">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
              <h2 className="text-xl font-bold">Add New User</h2>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border rounded p-2"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded p-2"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={adding}>
                  {adding ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserTeam;
