import { db } from '../src/lib/db';
import { staff } from '../src/lib/schema';

const staffData = [
  {
    name: 'Justin Jeter',
    title: 'Senior Minister',
    bio: 'Justin Jeter is grateful to be husband to Jamie and dad to Gabriel (6) and Willow (4). He did his seminary studies at Brite Divinity School in Fort Worth and Pacific School of Religion in California. He previously served at First Christian Church of North Hollywood, CA, and was Co-Founder of PurposeMatch.com. Justin also serves on the Board of Mission Granbury. He especially loves Isaiah 43 and the book of Luke, along with RV camping, pickleball, and puttering around the house. He\'s pretty sure he used to be at least 5\'8".',
    email: 'justin@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '0'
  },
  {
    name: 'Austin Staggs',
    title: 'Minister with Students & Seekers',
    bio: 'With a Bachelors in Youth and Family Ministry from Lubbock Christian University and a Master of Divinity from Brite Divinity School in Fort Worth, Austin has found a home serving as the Minister of Family Life at First Christian Church of Granbury. His hope for ministry is to facilitate real, authentic, and meaningful relationships centered in a Love that is greater than us all. Austin is Husband to Jordan and Dad to Hudson, Noah, and their family pup Annie. He believes that God is experienced in all of creation and likes to spend his time taking in the beauty of the outdoors, tending to the bees and chickens at home, and playing pickle ball or Kan-Jam in the church gym. He firmly believes that pineapples do indeed belong on pizza.',
    email: 'austin@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '1'
  },
  {
    name: 'Candy Stroup',
    title: 'Minister of Care & Spiritual Formation',
    bio: 'Candy (or Candace, if you prefer) is joyfully a fourth generation Disciple and connected with amazing church and biological families. She felt called to ministry as a teen, but life circumstances held that seminary education would happen later in life than the usual route. During that time, Candy continued to study and serve and feels that the Holy knew of the life experiences needed to inform her ministry. She received her Master of Divinity from Houston Graduate School of Theology (HGST) in 2008 and was ordained by the Christian Church of the Southwest that same year. She had begun Clinical Pastoral Education (chaplain training/residency) prior to graduation and continued working in chaplaincy until her retirement in 2021. For a couple of years, while still working more than full-time as a chaplain, Candy returned to HGST to study spiritual formation. When the position of Minister of Care and Spiritual Formation was posted by FCC, Candy felt the shepherd\'s crook pulling her toward it. She is grateful and excited to work with the Holy, with the awesome FCC staff, and with the amazing FCC congregation/community.',
    email: 'candy@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '2'
  },
  {
    name: 'Josh Newby',
    title: 'Minister of Music',
    bio: 'Josh leads worship with his guitar at our 9am worship service, and directs our Chancel Choir at 11am. In addition to his passion and talent for music, Josh has a degree in engineering and works in the IT department of Tarleton University. Josh lives in Granbury with his wife, Emily, and their daughter, Elliana.',
    email: 'josh@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '3'
  },
  {
    name: 'Heath Ramsey',
    title: 'Minister of Technology',
    bio: 'A native of Greenville, Texas, Granbury has been lucky to have Heath for the last 10 years. Heath and his Wife, Sarah, and son, Monte, have been at FCC since 2019, and he joined our staff in 2020. Heath has trained racehorses (as a groom & licensed trainer) from Texas to California and back. He is interested in music theory, and plays the guitar.',
    email: 'heath@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '4'
  },
  {
    name: 'Karlie Bold',
    title: 'Minister of Communications',
    bio: 'She has been a member of FCC since 2019 and lives in Tolar where she raises her 2 daughters with her husband, Rich. She takes care of communications for the church, such as the weekly newsletter and worship bulletins. She has a degree in anthropology, loves to lead a nature hike, and is always learning something new. She is currently enrolled in seminary, working towards her M.Div at Brite Divinity at TCU.',
    email: 'karlie@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '5'
  },
  {
    name: 'Emily Newby',
    title: 'Minister of Children & Congregational Life',
    bio: 'Emily joined the FCC staff a few years ago to work in the sound booth but in Aug. 2023 she became the Children and Congregational Life Minister to work with the children and church leadership teams. Emily has degrees in theatre, education, and library science. She lives in Granbury, Texas with her husband Josh Newby and their daughter Elliana.',
    email: 'emily@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '6'
  },
  {
    name: 'Emily Graham',
    title: 'Financial Assistant',
    bio: 'Emily Graham, a 7th generation Hood County resident, was born and raised in Granbury. She and her husband Tony have been married for 11 years and have two children: a 6-year-old son, Elliott, and a 3-year-old daughter, Allison. In her free time, Emily enjoys reading, spending time with her family, listening to long-form true crime podcasts, and finding a good bargain.',
    email: 'emily.graham@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '7'
  },
  {
    name: 'Laura Ricks',
    title: 'Office Manager',
    bio: 'Laura is in our church office Mondays through Thursdays. She and her husband, Rick, retired to Granbury and she uses her skills from her career as an administrator for railroads to keep our church running.',
    email: 'laura@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '8'
  },
  {
    name: 'Paula Walker',
    title: 'Office Manager',
    bio: 'Paula is in our church office Mondays through Thursdays. In addition to her work here, she is a talented chef and makes custom meals for clients with special dietary needs.',
    email: 'paula@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '9'
  },
  {
    name: 'Megan Griggs',
    title: 'Nursery Director',
    bio: 'Megan is the director of our nursery programs for infants through age 3! She and her husband, Ben, are parents to Rogan, Bryson & Scarlett. FCC is the church Megan grew up in since she was a child, so she finds it extra meaningful to provide a safe and loving church home to the kids of our congregation!',
    email: 'megan@fccgranbury.org',
    imageUrl: null,
    focalPoint: null,
    isActive: true,
    sortOrder: '10'
  }
];

async function seedStaffData() {
  try {
    console.log('Starting to seed staff data...');
    
    // Clear existing staff data
    await db.delete(staff);
    console.log('Cleared existing staff data');
    
    // Insert new staff data
    const insertedStaff = await db.insert(staff).values(staffData).returning();
    console.log(`Successfully inserted ${insertedStaff.length} staff members`);
    
    // Log each staff member
    insertedStaff.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} - ${member.title}`);
    });
    
    console.log('Staff data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding staff data:', error);
    throw error;
  }
}

// Run the seeding function
seedStaffData()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
