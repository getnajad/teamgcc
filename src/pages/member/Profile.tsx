import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';

export const MemberProfile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // State for Personal Info
  const [profile, setProfile] = useState({
    full_name: '',
    phone_number: '',
    whatsapp_number: '',
    date_of_birth: '',
    blood_group: '',
  });

  // State for GCC Info
  const [gccDetails, setGccDetails] = useState({
    country: '',
    city: '',
    visa_status: '',
    company_name: '',
    job_title: '',
    year_of_migration: '',
  });

  // State for Home Info
  const [homeDetails, setHomeDetails] = useState({
    house_name: '',
    panchayath_ward: '',
    family_location: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    norka_registered: false,
  });

  // State for Professional Info
  const [skillsDetails, setSkillsDetails] = useState({
    education: '',
    primary_skills: '',
    looking_for_job: false,
    resume_url: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Fetch public.profiles
        const { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (pData) {
          setProfile({
            full_name: pData.full_name || '',
            phone_number: pData.phone_number || '',
            whatsapp_number: pData.whatsapp_number || '',
            date_of_birth: pData.date_of_birth || '',
            blood_group: pData.blood_group || '',
          });
        }

        // Fetch gcc_details
        const { data: gData } = await supabase.from('gcc_details').select('*').eq('profile_id', user.id).single();
        if (gData) setGccDetails(gData);

        // Fetch home_details
        const { data: hData } = await supabase.from('home_details').select('*').eq('profile_id', user.id).single();
        if (hData) setHomeDetails(hData);

        // Fetch skills
        const { data: sData } = await supabase.from('skills').select('*').eq('profile_id', user.id).single();
        if (sData) setSkillsDetails(sData);

      } catch (error) {
        console.error('Error fetching profile data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Upsert profile
      const { error: pErr } = await supabase.from('profiles').update({
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        whatsapp_number: profile.whatsapp_number,
        date_of_birth: profile.date_of_birth || null,
        blood_group: profile.blood_group,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);
      if (pErr) throw pErr;

      // Upsert gcc_details
      const { error: gErr } = await supabase.from('gcc_details').upsert({
        profile_id: user.id,
        ...gccDetails
      });
      if (gErr) throw gErr;

      // Upsert home_details
      const { error: hErr } = await supabase.from('home_details').upsert({
        profile_id: user.id,
        ...homeDetails
      });
      if (hErr) throw hErr;

      // Upsert skills
      const { error: sErr } = await supabase.from('skills').upsert({
        profile_id: user.id,
        ...skillsDetails
      });
      if (sErr) throw sErr;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
      // Auto clear message
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Member Profile</h1>
        <p className="text-gray-500 mt-1">Complete your profile to connect with the community.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'bg-red-50 text-red-700 border-l-4 border-red-500'}`}>
          {message.text}
        </div>
      )}

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic details about you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email (Read Only)</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm bg-gray-50 text-gray-500" value={user?.email || ''} readOnly />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Phone Number</label>
              <input type="tel" className="w-full border rounded-md p-2 text-sm" value={profile.phone_number} onChange={e => setProfile({...profile, phone_number: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">WhatsApp Number</label>
              <input type="tel" className="w-full border rounded-md p-2 text-sm" value={profile.whatsapp_number} onChange={e => setProfile({...profile, whatsapp_number: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Date of Birth</label>
              <input type="date" className="w-full border rounded-md p-2 text-sm" value={profile.date_of_birth} onChange={e => setProfile({...profile, date_of_birth: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Blood Group</label>
              <select className="w-full border rounded-md p-2 text-sm bg-white" value={profile.blood_group} onChange={e => setProfile({...profile, blood_group: e.target.value})}>
                <option value="">Select...</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GCC Info */}
      <Card>
        <CardHeader>
          <CardTitle>GCC Information</CardTitle>
          <CardDescription>Details about your stay in the GCC.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Country</label>
              <select className="w-full border rounded-md p-2 text-sm bg-white" value={gccDetails.country} onChange={e => setGccDetails({...gccDetails, country: e.target.value})}>
                <option value="">Select...</option>
                <option value="UAE">UAE</option><option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Qatar">Qatar</option><option value="Kuwait">Kuwait</option>
                <option value="Oman">Oman</option><option value="Bahrain">Bahrain</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">City</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" value={gccDetails.city} onChange={e => setGccDetails({...gccDetails, city: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Visa Status</label>
              <select className="w-full border rounded-md p-2 text-sm bg-white" value={gccDetails.visa_status} onChange={e => setGccDetails({...gccDetails, visa_status: e.target.value})}>
                <option value="">Select...</option>
                <option value="Employment">Employment</option><option value="Visit">Visit</option>
                <option value="Family">Family</option><option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Year of Migration</label>
              <input type="number" className="w-full border rounded-md p-2 text-sm" placeholder="e.g. 2015" value={gccDetails.year_of_migration} onChange={e => setGccDetails({...gccDetails, year_of_migration: e.target.value})} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Company Name</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" value={gccDetails.company_name} onChange={e => setGccDetails({...gccDetails, company_name: e.target.value})} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Job Title</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" value={gccDetails.job_title} onChange={e => setGccDetails({...gccDetails, job_title: e.target.value})} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Home Info */}
      <Card>
        <CardHeader>
          <CardTitle>Home Information</CardTitle>
          <CardDescription>Your address and emergency contacts in Valapattanam.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">House Name / Address</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" value={homeDetails.house_name} onChange={e => setHomeDetails({...homeDetails, house_name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Panchayath Ward Number</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" value={homeDetails.panchayath_ward} onChange={e => setHomeDetails({...homeDetails, panchayath_ward: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Family Location (Mahallu / Area)</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" value={homeDetails.family_location} onChange={e => setHomeDetails({...homeDetails, family_location: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Emergency Contact Name</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" value={homeDetails.emergency_contact_name} onChange={e => setHomeDetails({...homeDetails, emergency_contact_name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Emergency Contact Number</label>
              <input type="tel" className="w-full border rounded-md p-2 text-sm" value={homeDetails.emergency_contact_number} onChange={e => setHomeDetails({...homeDetails, emergency_contact_number: e.target.value})} />
            </div>
            <div className="space-y-1 md:col-span-2 flex items-center gap-2 mt-2">
              <Checkbox 
                checked={homeDetails.norka_registered} 
                onCheckedChange={(checked) => setHomeDetails({...homeDetails, norka_registered: checked === true})} 
              />
              <label className="text-sm font-medium">Registered with NORKA Roots</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Professional & Job Search</CardTitle>
          <CardDescription>Education and job-seeking status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Highest Education</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" placeholder="e.g. B.Tech Computer Science" value={skillsDetails.education} onChange={e => setSkillsDetails({...skillsDetails, education: e.target.value})} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Primary Skills (comma separated)</label>
              <input type="text" className="w-full border rounded-md p-2 text-sm" placeholder="e.g. Project Management, AutoCAD, Sales" value={skillsDetails.primary_skills} onChange={e => setSkillsDetails({...skillsDetails, primary_skills: e.target.value})} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Resume Link (Google Drive / LinkedIn)</label>
              <input type="url" className="w-full border rounded-md p-2 text-sm" placeholder="https://..." value={skillsDetails.resume_url} onChange={e => setSkillsDetails({...skillsDetails, resume_url: e.target.value})} />
            </div>
            <div className="space-y-1 md:col-span-2 flex items-center gap-2 mt-2">
              <Checkbox 
                checked={skillsDetails.looking_for_job} 
                onCheckedChange={(checked) => setSkillsDetails({...skillsDetails, looking_for_job: checked === true})} 
              />
              <label className="text-sm font-medium text-primary font-semibold">I am currently looking for a job / career change</label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Saving Profile...' : 'Save Profile'}
        </Button>
      </div>

    </div>
  );
};
