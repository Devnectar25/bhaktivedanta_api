export const defaultDoctors = [
  {
    id: 'd1',
    name: 'Dr. Anand Sharma',
    qualifications: 'MBBS, MD (Cardiology)',
    department: 'Cardiology',
    subSpeciality: 'Interventional Cardiology',
    experience: '15 Years',
    availability: 'Available',
    featured: 'Yes',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANPEj_KoNMPpIwdzuCD7lYGdAKEkyCWh6bTaQK8MJs_R4JVyJRsEBiMWrTQzDsV176cPtU3yccFuudW15cKMl437nzqw5tE9A3l9ZZfasQ9SJx96vYIX962IHbmK_xdfUiAohF8eavUhpXeVEW2mV78f5ATYHcgBnBWY8_UJEKzHq4bco6SZZlKcz-S4YZpKBmO1txtux3VF6wZXMQIop-vEphp1s5HxLkKU8I_EDCo-tkZYHkrT4Ut51mTZnyQ3xI9td7l-2oX0w'
  },
  {
    id: 'd2',
    name: 'Dr. Sunita Mehta',
    qualifications: 'MBBS, DCH (Pediatrics)',
    department: 'Pediatrics',
    subSpeciality: 'Neonatology',
    experience: '12 Years',
    availability: 'Busy',
    featured: 'No',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCctp6yfJXf7-1rFuObb0Ki2WL_4iCXFdr-eeffAgsiEZprEBPHOITEx4lJ0ZWTsXptmVimAX02smmRNrEPwmNtaF7dixkBM6uBPqP8VS4iQ1ABwARcVsAB3sC4yikrBK00EVlJ3DccFWO6eFC2IHJGB1YA9CQ6sVwNk8ddW7A75POQ8GrGXGUUMUnB0J3eAMfa1R1DjZW9haVx1D0xDPuDGFDW2QHuIrzO0i6ewLX5xojfAXkHV34sQ8BZn_GbfXZfFQJlz1oxUg'
  },
  {
    id: 'd3',
    name: 'Dr. Rajesh Kulkarni',
    qualifications: 'MS (Orthopedics)',
    department: 'Orthopedics',
    subSpeciality: 'Spine Surgery',
    experience: '20 Years',
    availability: 'Available',
    featured: 'Yes',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdmg0ndil9ygADvQlpCQmfNoIcNC45P9w5ROaS-TN6viovJ7ua3O24RzZYzLfTVj9t96-3KNF1OfDuw9ScwW29oKTg3cDqGJ4XgHANO7_tJ0x47COi4X5JOnr8kR-VGei69sIsz0FIQcDJ48vjI1UfIy73TDBjHz5rul75v0EVd33BlzU1VhW38IAadSKb-eDGGK5iV6PNrasvuzfmR1S5QdoIi6e1BhwOb_6H2DlyZ1uprGGWWu6nsM4ehW5RgyfYYdqFbVXbass'
  },
  {
    id: 'd4',
    name: 'Dr. Priya Verma',
    qualifications: 'MD (Oncology)',
    department: 'Oncology',
    subSpeciality: 'Radiation Therapy',
    experience: '8 Years',
    availability: 'On Leave',
    featured: 'No',
    status: 'Inactive',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_HdwQUWFnwru1ZmIwrY4NBuEZ0_fKr5D2deJZ2IpoYbAYg8C4xB2wArEBfoFdTL42_089Du30ABxXwFERzM71sgFeUmXijTwlFYzt07mbY49JGxol4KT8g8LwA8x7U9LoroDDUSoWvOEDUCJOUurArP91HcNw8PpdVaUbas3sOrq4P9ElWiH6GLam51S89hffsSD3FX55tCwiZ9Dmrtj7AdfVNDNi_Hl3-TXWzuPP3qVVCCeahAhDc7T16QVNGY30Ls65W5QROBE'
  }
];

export const defaultAppointments = [
  {
    id: 'APT-4902',
    patientName: 'Amit Sharma',
    patientPhone: '+91 98765 43210',
    doctorName: 'Dr. Anand Sharma',
    department: 'Cardiology',
    dateTime: '24 Oct, 2023 10:30 AM',
    payment: 'Paid',
    status: 'Confirmed'
  },
  {
    id: 'APT-4903',
    patientName: 'Priya Kapoor',
    patientPhone: '+91 88776 55443',
    doctorName: 'Dr. Sunita Mehta',
    department: 'Pediatrics',
    dateTime: '24 Oct, 2023 11:15 AM',
    payment: 'Partial',
    status: 'Pending'
  },
  {
    id: 'APT-4899',
    patientName: 'Rohan Joshi',
    patientPhone: '+91 77665 44332',
    doctorName: 'Dr. Rajesh Kulkarni',
    department: 'Orthopedics',
    dateTime: '23 Oct, 2023 04:45 PM',
    payment: 'Paid',
    status: 'Completed'
  },
  {
    id: 'APT-4905',
    patientName: 'Sunita Bansal',
    patientPhone: '+91 99008 87766',
    doctorName: 'Dr. Priya Verma',
    department: 'Oncology',
    dateTime: '25 Oct, 2023 09:00 AM',
    payment: 'Unpaid',
    status: 'Cancelled'
  }
];

export const defaultEvents = [
  {
    id: 'EVT-101',
    title: 'Free Heart Health Check-up Camp',
    date: '28 Oct, 2023',
    time: '09:00 AM - 04:00 PM',
    venue: 'Hospital Ground Floor, OPD Block',
    status: 'Upcoming',
    description: 'Providing free ECG, blood pressure monitoring, and consultations with leading cardiologists.'
  },
  {
    id: 'EVT-102',
    title: 'CME on Advanced Laparoscopic Surgery',
    date: '15 Nov, 2023',
    time: '11:00 AM - 02:00 PM',
    venue: 'Seminar Hall, 4th Floor',
    status: 'Scheduled',
    description: 'A professional continuing medical education program for consulting surgeons and residents.'
  }
];

export const defaultTestimonials = [
  {
    id: 'TST-201',
    patientName: 'Harish Mehta',
    disease: 'Angioplasty Patient',
    content: 'The care and attention I received at Bhaktivedanta Hospital was exceptional. Dr. Anand Sharma is highly professional and compassionate.',
    rating: 5,
    status: 'Approved'
  },
  {
    id: 'TST-202',
    patientName: 'Nalini Iyer',
    disease: 'Maternity Care',
    content: 'Very clean facilities and caring nursing staff. Standard protocols were strictly followed during my delivery. Highly recommended.',
    rating: 5,
    status: 'Approved'
  }
];

export const defaultNews = [
  {
    id: 'NWS-301',
    title: 'Bhaktivedanta Hospital Awarded NABH Accreditation',
    date: '10 Oct, 2023',
    category: 'Achievements',
    status: 'Published',
    content: 'We are proud to announce that our hospital has successfully received NABH accreditation, validating our standard clinical quality.'
  },
  {
    id: 'NWS-302',
    title: 'New Pediatric ICU Wing Inaugurated',
    date: '05 Oct, 2023',
    category: 'Announcements',
    status: 'Published',
    content: 'A state-of-the-art Pediatric Intensive Care Unit with 12 beds has been inaugurated on the 3rd floor by our Director.'
  }
];

export const defaultGallery = [
  {
    id: 'GAL-401',
    title: 'Main Hospital Building',
    category: 'Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    status: 'Active'
  },
  {
    id: 'GAL-402',
    title: 'Advanced Diagnostic Lab',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop',
    status: 'Active'
  }
];

export const defaultQueries = [
  {
    id: 'QRY-501',
    name: 'Suresh Patil',
    email: 'suresh.patil@gmail.com',
    subject: 'Inquiry regarding Health Check-up Packages',
    message: 'Could you please provide details on pre-employment health screening packages?',
    date: '15 Jun, 2026',
    status: 'Pending'
  },
  {
    id: 'QRY-502',
    name: 'Meena Rao',
    email: 'meena.rao@yahoo.com',
    subject: 'Doctor Appointment availability',
    message: 'I would like to know if Dr. Rajesh Kulkarni is available on coming Thursday for orthopedics consultation.',
    date: '15 Jun, 2026',
    status: 'Resolved'
  }
];

export const defaultSubAdmins = [
  {
    username: 'admin.sneha',
    email: 'sneha@bhaktivedantahospital.com',
    role: 'Administration',
    status: 'Active',
    created: '12 Oct 2023'
  },
  {
    username: 'admin.rajesh',
    email: 'rajesh@bhaktivedantahospital.com',
    role: 'Administration',
    status: 'Active',
    created: '15 Oct 2023'
  }
];

export const defaultHelpDesk = [
  {
    id: 'HD-801',
    ticketNo: 'TCK-1001',
    requesterName: 'Ramesh Gupta',
    requesterEmail: 'ramesh.gupta@gmail.com',
    category: 'Appointment Issue',
    priority: 'High',
    status: 'In Progress',
    subject: 'Unable to reschedule appointment for Cardiology',
    description: 'I tried to modify my booking for Thursday 3 PM but the portal threw a payment verification timeout.',
    created: '2026-08-25 14:30',
    response: 'Assigned to Support Specialist. Contacted patient for booking reference.'
  },
  {
    id: 'HD-802',
    ticketNo: 'TCK-1002',
    requesterName: 'Pooja Verma',
    requesterEmail: 'pooja.verma@yahoo.com',
    category: 'Portal Access',
    priority: 'Medium',
    status: 'Pending',
    subject: 'OTP not received during login',
    description: 'SMS verification codes are arriving with a 15-minute delay on Airtel numbers.',
    created: '2026-08-26 09:15',
    response: ''
  },
  {
    id: 'HD-803',
    ticketNo: 'TCK-1003',
    requesterName: 'Dr. S. K. Joshi',
    requesterEmail: 'dr.joshi@bhaktivedanta.com',
    category: 'IT Infrastructure',
    priority: 'Urgent',
    status: 'Resolved',
    subject: 'OPD Printer offline in Room 204',
    description: 'Thermal receipt printer disconnected from LAN network.',
    created: '2026-08-24 11:00',
    response: 'Network cable replaced and printer driver reinstalled. Verified working.'
  }
];

export const defaultAppErrors = [
  {
    id: 'ERR-901',
    timestamp: '2026-08-26 10:45:12',
    level: 'Error',
    source: 'Database Query',
    message: 'Supabase real-time connection failure: Node 20 WebSocket initialization',
    endpoint: '/api/specialities-state',
    status: 'Resolved',
    details: 'Configured globalThis.WebSocket fallback via ws transport.'
  },
  {
    id: 'ERR-902',
    timestamp: '2026-08-26 08:30:00',
    level: 'Warning',
    source: 'CORS Middleware',
    message: 'CORS header missing for origin http://127.0.0.1:5173',
    endpoint: '/api/doctors',
    status: 'Resolved',
    details: 'Updated CORS allowed origins in server.js middleware.'
  },
  {
    id: 'ERR-903',
    timestamp: '2026-08-25 18:22:40',
    level: 'Critical',
    source: 'API Gateway',
    message: 'HTTP 500: Database table bv_doctors not found in Supabase schema',
    endpoint: '/api/doctors',
    status: 'Investigating',
    details: 'Database table bv_doctors requires verification in Supabase dashboard.'
  }
];

export const defaultSpecialitiesState = {
  view: 'listing',
  activeCategoryId: null,
  activeSpecialityId: null,
  activeTabId: 't1',
  categories: [
    { id: 'c3', name: 'Centres Of Excellence', description: 'World-class multidisciplinary care centres providing specialized treatments.', status: true, order: 1, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' },
    { id: 'c1', name: 'General Specialities', description: 'Comprehensive general healthcare services for everyday medical needs.', status: true, order: 2, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' },
    { id: 'c2', name: 'Super Specialities', description: 'Advanced medical treatments and interventions by expert specialists.', status: true, order: 3, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' },
    { id: 'c4', name: 'Alternative Medicine & Therapy', description: 'Holistic approaches to healing, integrating traditional and natural therapies.', status: true, order: 4, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' },
    { id: 'c1787829354773', name: 'ABC', description: 'Healthcare & Wellness Category ABC', status: true, order: 5, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2026-08-27T11:15:54.773Z', updatedAt: '2026-09-03T15:48:47.233Z' },
    { id: 'c1788451000054', name: 'XYZ', description: 'Clinical Services Category XYZ', status: true, order: 6, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2026-09-03T15:56:40.054Z', updatedAt: '2026-09-03T15:56:40.054Z' }
  ],
  specialities: [
    // General Specialities (c1) - 14 items
    { id: 's1', categoryId: 'c1', name: 'Anesthesiology', icon: 'vaccines', shortDescription: 'Safe pain management and critical life support before, during, and after surgery.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's2', categoryId: 'c1', name: 'Critical Care', icon: 'monitor_heart', shortDescription: '24/7 intensive care monitoring for life-threatening clinical conditions.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's3', categoryId: 'c1', name: 'Dermatology & Venerology', icon: 'dermatology', shortDescription: 'Comprehensive care for skin, hair, nail, and venereal disorders.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's4', categoryId: 'c1', name: 'Dentistry', icon: 'dentistry', shortDescription: 'Advanced oral health, cosmetic dentistry, and maxillo-facial surgery.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's5', categoryId: 'c1', name: 'E.N.T', icon: 'hearing', shortDescription: 'Specialized treatment for ear, nose, throat, head, and neck conditions.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's6', categoryId: 'c1', name: 'General Medicine', icon: 'stethoscope', shortDescription: 'Primary clinical care, chronic disease management, and adult medicine.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's7', categoryId: 'c1', name: 'General & Minimal Access Surgery', icon: 'medical_services', shortDescription: 'Comprehensive laparoscopic, endoscopic, and general surgical care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's8', categoryId: 'c1', name: 'Gynaecology & Obstetrics', icon: 'female', shortDescription: 'Comprehensive women’s health, high-risk maternity, and gynecological surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's9', categoryId: 'c1', name: 'Nutrition & Dietetics', icon: 'nutrition', shortDescription: 'Personalized clinical nutrition, therapeutic diet planning, and wellness.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's10', categoryId: 'c1', name: 'Pain Management', icon: 'healing', shortDescription: 'Multidisciplinary relief procedures for acute and chronic pain conditions.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's11', categoryId: 'c1', name: 'Palliative Care', icon: 'volunteer_activism', shortDescription: 'Compassionate symptom management and supportive care for chronic illness.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's12', categoryId: 'c1', name: 'Psychiatry & Clinical Psychology', icon: 'psychology', shortDescription: 'Comprehensive mental health counseling, therapy, and psychiatric care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's13', categoryId: 'c1', name: 'Rehabilitation', icon: 'accessibility_new', shortDescription: 'Physiotherapy, occupational recovery, and mobility restoration.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's14', categoryId: 'c1', name: 'Rheumatology', icon: 'personal_injury', shortDescription: 'Expert care for autoimmune diseases, arthritis, and joint inflammations.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },

    // Super Specialities (c2) - 12 items
    { id: 's15', categoryId: 'c2', name: 'Pulmonology & Sleep Medicine', icon: 'pulmonology', shortDescription: 'Advanced diagnosis and care for complex lung and sleep-disordered breathing.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's16', categoryId: 'c2', name: 'Clinical Genetics', icon: 'genetics', shortDescription: 'Genetic counseling, hereditary disease screening, and diagnostic evaluation.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's17', categoryId: 'c2', name: 'Diabetology', icon: 'blood_pressure', shortDescription: 'Comprehensive management of Type 1, Type 2, and gestational diabetes.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's18', categoryId: 'c2', name: 'Integrated Medicine', icon: 'local_pharmacy', shortDescription: 'Combining modern evidence-based therapies with holistic natural healing.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's19', categoryId: 'c2', name: 'Endocrinology & Endocrine Surgery', icon: 'health_metrics', shortDescription: 'Treatment for thyroid, hormonal, metabolic, and adrenal gland disorders.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's20', categoryId: 'c2', name: 'Gastroenterology & Gastrosurgery', icon: 'digestive', shortDescription: 'Advanced digestive system treatment and GI endoscopic procedures.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's21', categoryId: 'c2', name: 'Hematology & Hemato-Oncology', icon: 'bloodtype', shortDescription: 'Specialized diagnosis and management of blood and bone marrow diseases.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's22', categoryId: 'c2', name: 'Infectious Disease', icon: 'coronavirus', shortDescription: 'Treatment for complex, tropical, resistant, and hospital-acquired infections.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's23', categoryId: 'c2', name: 'Nephrology', icon: 'nephrology', shortDescription: 'Advanced kidney disease management, hemodialysis, and renal care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's24', categoryId: 'c2', name: 'Plastic & Reconstructive Surgery', icon: 'content_cut', shortDescription: 'Reconstructive procedures, burn care, and aesthetic surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's25', categoryId: 'c2', name: 'Vascular & Endovascular Surgery', icon: 'cardiology', shortDescription: 'Minimally invasive endovascular interventions and vascular surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's26', categoryId: 'c2', name: 'Urology', icon: 'water_drop', shortDescription: 'Comprehensive care for urinary tract, kidney stones, and male reproductive health.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },

    // Alternative Medicine & Therapy (c4) - 4 items
    { id: 's27', categoryId: 'c4', name: 'Acupuncture', icon: 'healing', shortDescription: 'Traditional precision needle therapy for pain relief and neurological balance.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's28', categoryId: 'c4', name: 'Ayurveda', icon: 'eco', shortDescription: 'Traditional Indian holistic healing, Panchakarma, and wellness therapies.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's29', categoryId: 'c4', name: 'Homeopathy', icon: 'medication', shortDescription: 'Natural remedies tailored for safe, gentle, and effective healing.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's30', categoryId: 'c4', name: 'Yoga', icon: 'self_improvement', shortDescription: 'Therapeutic yoga, pranayama, and meditation for physical and mental health.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },

    // Centres Of Excellence (c3) - 7 items
    { id: 's31', categoryId: 'c3', name: 'Bone & Joint Centre', icon: 'orthopedics', shortDescription: 'World-class joint replacements, trauma care, and orthopedic surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's32', categoryId: 'c3', name: 'Cancer Centre', icon: 'oncology', shortDescription: 'Multidisciplinary medical, surgical, and radiation oncology services.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's33', categoryId: 'c3', name: 'Eye Care Centre', icon: 'visibility', shortDescription: 'State-of-the-art ophthalmology, cataract, retina, and laser vision care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's34', categoryId: 'c3', name: 'Heart Centre', icon: 'favorite', shortDescription: 'Advanced interventional cardiology, heart surgeries, and cardiac ICU.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's35', categoryId: 'c3', name: 'Vascular Interventional Radiology', icon: 'radiology', shortDescription: 'Pinhole image-guided interventions for vascular and tumor treatments.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's36', categoryId: 'c3', name: 'Neurosciences', icon: 'neurology', shortDescription: 'Expert care for brain, spine, stroke, and complex neurological disorders.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's37', categoryId: 'c3', name: 'Pediatrics & Pediatrics Surgery', icon: 'child_care', shortDescription: 'Comprehensive pediatric care, NICU/PICU, and specialized child surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' }
  ]
};

// Ensure standard tabs for fallback data in case any speciality is missing it
export function ensureStandardTabs(spec) {
  const standardTabs = [
    { id: 't1', title: 'Overview', content: `<p>Welcome to the ${spec.name} department. We provide comprehensive care and support tailored to each patient's needs.</p>`, images: [] },
    { id: 't2', title: 'Why Choose Us', content: `<p>Our ${spec.name} department stands out for its experienced professionals, modern equipment, and dedicated compassionate care.</p>`, images: [] },
    { id: 't3', title: 'Technology & Infrastructure', content: `<p>We utilize advanced diagnostics and treatment facilities to deliver high-quality, precise clinical results in ${spec.name}.</p>`, images: [] },
    { id: 't4', title: 'Services', content: `<p>We offer a wide range of inpatient and outpatient services under ${spec.name} to cater to diverse medical requirements.</p>`, images: [] },
    { id: 't5', title: 'Our Experts', content: `<p>Meet our leading specialist physicians and support staff who work together to ensure your well-being.</p>`, images: [] }
  ];

  if (!spec.tabs || spec.tabs.length === 0) {
    spec.tabs = standardTabs;
  } else {
    const currentOverview = spec.tabs.find(t => t.title === 'Overview' || t.id === 't1');
    let overviewContent = `<p>Welcome to the ${spec.name} department. We provide comprehensive care and support tailored to each patient's needs.</p>`;

    if (currentOverview) {
      if (currentOverview.content) {
        overviewContent = currentOverview.content;
      } else if (currentOverview.blocks && currentOverview.blocks[0]) {
        overviewContent = `<p>${currentOverview.blocks[0].content}</p>`;
      } else if (spec.shortDescription) {
        overviewContent = `<p>${spec.shortDescription}</p>`;
      }
    }

    spec.tabs = [
      { id: 't1', title: 'Overview', content: overviewContent, images: currentOverview?.images || [] },
      { id: 't2', title: 'Why Choose Us', content: (spec.tabs.find(t => t.title === 'Why Choose Us' || t.id === 't2')?.content) || standardTabs[1].content, images: (spec.tabs.find(t => t.title === 'Why Choose Us' || t.id === 't2')?.images) || [] },
      { id: 't3', title: 'Technology & Infrastructure', content: (spec.tabs.find(t => t.title === 'Technology & Infrastructure' || t.id === 't3')?.content) || standardTabs[2].content, images: (spec.tabs.find(t => t.title === 'Technology & Infrastructure' || t.id === 't3')?.images) || [] },
      { id: 't4', title: 'Services', content: (spec.tabs.find(t => t.title === 'Services' || t.id === 't4')?.content) || standardTabs[3].content, images: (spec.tabs.find(t => t.title === 'Services' || t.id === 't4')?.images) || [] },
      { id: 't5', title: 'Our Experts', content: (spec.tabs.find(t => t.title === 'Our Experts' || t.id === 't5')?.content) || standardTabs[4].content, images: (spec.tabs.find(t => t.title === 'Our Experts' || t.id === 't5')?.images) || [] }
    ];
  }
}

defaultSpecialitiesState.specialities.forEach(ensureStandardTabs);

export function ensureStandardServiceTabs(srv) {
  const standardTabs = [
    { id: 't1', title: 'Overview', content: `<p>Welcome to our ${srv.name} services. We are dedicated to providing compassionate care and advanced treatments tailored to patient needs.</p>`, images: [] },
    { id: 't2', title: 'Services', content: `<p>We offer a comprehensive suite of clinical services and diagnostic evaluations under ${srv.name}.</p>`, images: [] },
    { id: 't3', title: 'Facilities', content: `<p>Our department is equipped with state-of-the-art medical technology and comfortable care rooms.</p>`, images: [] },
    { id: 't4', title: 'Patient Testimonials', content: `<p>Read inspiring stories and feedback from patients who recovered through our ${srv.name} services.</p>`, images: [] },
    { id: 't5', title: 'Photo Gallery', content: `<p>Take a virtual tour of our facilities, equipment, and medical care areas.</p>`, images: [] }
  ];

  if (!srv.tabs || srv.tabs.length === 0) {
    srv.tabs = standardTabs;
  }
}

export const defaultServicesState = {
  categories: [
    { id: 'c1', name: 'Healthcare Services', description: 'Specialized medical and clinical healthcare services.', status: true, order: 1, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' },
    { id: 'c2', name: '24*7', description: '24/7 round-the-clock emergency, diagnostic, and support services.', status: true, order: 2, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' }
  ],
  services: [
    // Healthcare Services (c1)
    { id: 'srv1', categoryId: 'c1', name: 'wHolistic Wellness', icon: 'self_improvement', shortDescription: 'Integrative therapies combining modern science with ancient wisdom.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv2', categoryId: 'c1', name: 'ISKCON Devotees Healthcare Services', icon: 'diversity_1', shortDescription: 'Customized healthcare packages and support desk for ISKCON devotees.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv3', categoryId: 'c1', name: 'Palliative Care', icon: 'volunteer_activism', shortDescription: 'Compassionate care for patients with life-limiting serious illnesses.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv4', categoryId: 'c1', name: 'Community Services', icon: 'groups', shortDescription: 'Free diagnostic camps, mobile clinics, and rural community clinics.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv5', categoryId: 'c1', name: 'Garbha Samskar', icon: 'pregnant_woman', shortDescription: 'Holistic prenatal therapy and education for healthy spiritual pregnancy.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv6', categoryId: 'c1', name: 'Swaasthya : The Organic Shop', icon: 'store', shortDescription: 'Pure organic foods, grains, natural remedies, and health products.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv7', categoryId: 'c1', name: 'Optical Shop', icon: 'visibility', shortDescription: 'High quality spectacles, contact lenses, and frame fitting facility.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv8', categoryId: 'c1', name: 'Speech & Audiology', icon: 'hearing', shortDescription: 'Specialized speech assessments, hearing aid fittings, and therapies.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv9', categoryId: 'c1', name: 'Dialysis Unit', icon: 'water_drop', shortDescription: 'Advanced hemodialysis, clean RO water systems, and 24/7 emergency support.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv10', categoryId: 'c1', name: 'Nursing Department', icon: 'medical_services', shortDescription: 'Compassionate, round-the-clock professional clinical nursing care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },

    // 24*7 Services (c2)
    { id: 'srv11', categoryId: 'c2', name: 'Trauma & Emergency Centre', icon: 'siren', shortDescription: '24/7 emergency response, fully equipped crash carts, and trauma doctors.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv12', categoryId: 'c2', name: 'Ambulance', icon: 'airport_shuttle', shortDescription: '24/7 fully equipped advanced cardiac life support ambulance fleet.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv13', categoryId: 'c2', name: 'Pathology', icon: 'biotech', shortDescription: '24/7 highly precise diagnostic blood test and pathology lab.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv14', categoryId: 'c2', name: 'Radiology', icon: 'settings_overscan', shortDescription: '24/7 advanced CT scans, X-rays, MRI, and ultrasonography.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv15', categoryId: 'c2', name: 'Pharmacy', icon: 'local_pharmacy', shortDescription: '24/7 genuine prescription medicines, drugs, and healthcare products.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv16', categoryId: 'c2', name: 'Blood Storage Centre', icon: 'bloodtype', shortDescription: '24/7 authenticated blood storage, cross-matching, and typing facility.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' }
  ]
};

export const defaultPatientCornerState = {
  categories: [
    {
      id: 'cat-inpatient',
      name: 'Inpatient Guide',
      slug: 'inpatient-guide',
      description: 'Guidelines and instructions for admitted patients and their families.',
      order: 1,
      status: true,
      adminId: 'ADM-001',
      adminName: 'Super Administrator',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-20T10:00:00.000Z'
    },
    {
      id: 'cat-visitor',
      name: 'Visitor Rules',
      slug: 'visitor-rules',
      description: 'Visiting hours, ICU guidelines, and hospital visitor policies.',
      order: 2,
      status: true,
      adminId: 'ADM-001',
      adminName: 'Super Administrator',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-15T10:00:00.000Z'
    },
    {
      id: 'cat-billing',
      name: 'Billing Help',
      slug: 'billing-help',
      description: 'Insurance, cashless claims, and billing department procedures.',
      order: 3,
      status: true,
      adminId: 'ADM-001',
      adminName: 'Super Administrator',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-10T10:00:00.000Z'
    },
    {
      id: 'cat-discharge',
      name: 'Discharge Process',
      slug: 'discharge-process',
      description: 'Step-by-step discharge protocol, summary handover, and post-discharge care.',
      order: 4,
      status: true,
      adminId: 'ADM-001',
      adminName: 'Super Administrator',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-01T10:00:00.000Z'
    }
  ],
  guides: [
    {
      id: 'pc-1',
      categoryId: 'cat-inpatient',
      category: 'Inpatient Guide',
      title: 'Admission',
      slug: 'admission',
      shortDescription: 'Comprehensive guide covering inpatient admission protocols, room accommodation, billing formalities, and discharge.',
      bannerImage: '',
      status: 'Published',
      displayOrder: 1,
      adminId: 'ADM-001',
      adminName: 'Super Administrator',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-20T10:00:00.000Z',
      tabs: [
        {
          id: 'tab-pc1-1',
          title: 'Admission Process',
          type: 'steps',
          order: 1,
          enabled: true,
          content: '<p>Welcome to Bhaktivedanta Hospital & Research Institute. Our admission desk assists patients and families with seamless inpatient admission.</p>',
          steps: [
            { step: 1, title: 'Doctor Recommendation', description: 'Obtain an admission note or prescription from the treating consultant doctor.' },
            { step: 2, title: 'Registration & Verification', description: 'Present identity proof, insurance documents, and complete the admission form at the admission desk.' },
            { step: 3, title: 'Room Selection & Deposit', description: 'Choose available room category and complete initial admission formalities.' },
            { step: 4, title: 'Ward Transfer', description: 'Nursing staff escorts the patient to the designated room or ward.' }
          ],
          items: [],
          cards: [],
          galleryImages: [],
          faqs: [],
          sections: [
            {
              id: 'sec-adm-1',
              title: 'Admission Workflow',
              type: 'steps',
              order: 1,
              enabled: true,
              content: '<p>Welcome to Bhaktivedanta Hospital & Research Institute. Our admission desk assists patients and families with seamless inpatient admission.</p>',
              steps: [
                { step: 1, title: 'Doctor Recommendation', description: 'Obtain an admission note or prescription from the treating consultant doctor.' },
                { step: 2, title: 'Registration & Verification', description: 'Present identity proof, insurance documents, and complete the admission form at the admission desk.' },
                { step: 3, title: 'Room Selection & Deposit', description: 'Choose available room category and complete initial admission formalities.' },
                { step: 4, title: 'Ward Transfer', description: 'Nursing staff escorts the patient to the designated room or ward.' }
              ],
              items: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            }
          ]
        },
        {
          id: 'tab-pc1-2',
          title: 'Accommodation',
          type: 'checklist',
          order: 2,
          enabled: true,
          content: '<p>Our inpatient accommodations are designed to provide a quiet, clean, and spiritually uplifting environment for speedy recovery.</p>',
          steps: [],
          items: [
            { text: 'General Ward, Twin Sharing Semi-Private, and Single Private Deluxe room options', checked: true, note: 'Room categories' },
            { text: 'One designated attendant pass provided per admitted patient', checked: true, note: 'Attendant policy' },
            { text: '24/7 central nurse call station and dedicated resident doctor coverage', checked: true, note: 'Clinical support' },
            { text: 'Nutritious pure vegetarian meals planned by certified clinical dietitians', checked: true, note: 'Dietary service' },
            { text: 'Daily housekeeping and rigorous hospital infection control protocols', checked: true, note: 'Hygiene standard' }
          ],
          cards: [],
          galleryImages: [],
          faqs: [],
          sections: [
            {
              id: 'sec-acc-1',
              title: 'Economy & Day Care',
              type: 'rich_text',
              order: 1,
              enabled: true,
              content: '<p>Economical inpatient beds and dedicated day care units for short-stay procedures, dialysis, and chemotherapy treatments under continuous clinical supervision.</p>',
              items: [],
              steps: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            },
            {
              id: 'sec-acc-2',
              title: 'Deluxe Room',
              type: 'rich_text',
              order: 2,
              enabled: true,
              content: '<p>Spacious single-occupancy air-conditioned private room with attached bathroom, patient entertainment TV, attendant couch, and personalized dietary service.</p>',
              items: [],
              steps: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            },
            {
              id: 'sec-acc-3',
              title: 'AC Triple Sharing',
              type: 'rich_text',
              order: 3,
              enabled: true,
              content: '<p>Air-conditioned room shared by three patients with individual privacy curtains, central nurse call system, and dedicated bedside locker facilities.</p>',
              items: [],
              steps: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            },
            {
              id: 'sec-acc-4',
              title: 'AC Twin Sharing',
              type: 'rich_text',
              order: 4,
              enabled: true,
              content: '<p>Semi-private air-conditioned room shared between two patients with privacy partitions, attendant seating, and television.</p>',
              items: [],
              steps: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            },
            {
              id: 'sec-acc-5',
              title: 'AC Multiple Sharing',
              type: 'rich_text',
              order: 5,
              enabled: true,
              content: '<p>Comfortable, sanitized general ward setting with air conditioning, centralized oxygen/suction ports, and 24/7 nursing station monitoring.</p>',
              items: [],
              steps: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            },
            {
              id: 'sec-acc-6',
              title: 'AC First Class',
              type: 'rich_text',
              order: 6,
              enabled: true,
              content: '<p>Individual private room with air conditioning, attached washroom, sofa for attendant, and priority doctor rounds.</p>',
              items: [],
              steps: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            },
            {
              id: 'sec-acc-7',
              title: 'Suite',
              type: 'rich_text',
              order: 7,
              enabled: true,
              content: '<p>Premium healthcare suite comprising a patient recovery room, separate attendant living lounge, dining area, refrigerator, and dedicated nurse attention.</p>',
              items: [],
              steps: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            },
            {
              id: 'sec-acc-8',
              title: 'Premium',
              type: 'rich_text',
              order: 8,
              enabled: true,
              content: '<p>Top-tier inpatient accommodations with upgraded amenities, peaceful ambiance, and personalized care coordination.</p>',
              items: [],
              steps: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            }
          ]
        },
      ]
    },
    {
      id: "pc-3",
      categoryId: "cat-billing",
      category: "Billing Help",
      title: "Empanelled Corporate / TPA / Insurances",
      slug: "empanelled-corporate-tpa-insurances",
      shortDescription: "Comprehensive directory of empanelled corporate organizations, health insurance providers, and Third Party Administrators (TPAs) offering cashless hospitalization services.",
      bannerImage: "",
      status: "Published",
      displayOrder: 3,
      adminId: "ADM-001",
      adminName: "Super Administrator",
      createdAt: "2026-08-01T10:00:00.000Z",
      updatedAt: "2026-09-15T10:00:00.000Z",
      tabs: [
            {
                  id: "tab-pc3-1",
                  title: "List of Corporates / TPA's / Insurance Companies",
                  type: "accordion",
                  order: 1,
                  enabled: true,
                  content: "<p>Bhaktivedanta Hospital & Research Institute is empanelled with leading corporate entities, national and private health insurance companies, and Third Party Administrators (TPAs) to facilitate hassle-free cashless hospitalization and credit services for patients and their beneficiaries.</p>",
                  steps: [],
                  items: [],
                  cards: [],
                  galleryImages: [],
                  faqs: [],
                  logos: [],
                  sections: [
                        {
                              id: "sec-empanelled-accordion",
                              title: "Empanelled Corporate / TPA / Insurance Companies",
                              type: "accordion",
                              order: 1,
                              enabled: true,
                              content: "",
                              accordionItems: [
                                    {
                                          id: "acc-item-corp",
                                          title: "Corporates",
                                          contentType: "logo_grid",
                                          enabled: true,
                                          logos: [
                                                {
                                                      id: "logo-c1",
                                                      name: "Tata Consultancy Services (TCS)",
                                                      imageUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80",
                                                      order: 1,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-c2",
                                                      name: "Larsen & Toubro (L&T)",
                                                      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
                                                      order: 2,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-c3",
                                                      name: "Reliance Industries Limited",
                                                      imageUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=300&auto=format&fit=crop&q=80",
                                                      order: 3,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-c4",
                                                      name: "Mahindra & Mahindra",
                                                      imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80",
                                                      order: 4,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-c5",
                                                      name: "Godrej Group",
                                                      imageUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&auto=format&fit=crop&q=80",
                                                      order: 5,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-c6",
                                                      name: "Infosys Limited",
                                                      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80",
                                                      order: 6,
                                                      enabled: true
                                                }
                                          ]
                                    },
                                    {
                                          id: "acc-item-ins",
                                          title: "Insurance Company",
                                          contentType: "logo_grid",
                                          enabled: true,
                                          logos: [
                                                {
                                                      id: "logo-i1",
                                                      name: "Star Health and Allied Insurance",
                                                      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80",
                                                      order: 1,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-i2",
                                                      name: "HDFC ERGO General Insurance",
                                                      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80",
                                                      order: 2,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-i3",
                                                      name: "ICICI Lombard General Insurance",
                                                      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80",
                                                      order: 3,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-i4",
                                                      name: "Bajaj Allianz General Insurance",
                                                      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&auto=format&fit=crop&q=80",
                                                      order: 4,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-i5",
                                                      name: "Niva Bupa Health Insurance",
                                                      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&auto=format&fit=crop&q=80",
                                                      order: 5,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-i6",
                                                      name: "National Insurance Company",
                                                      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80",
                                                      order: 6,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-i7",
                                                      name: "The New India Assurance Co. Ltd.",
                                                      imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80",
                                                      order: 7,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-i8",
                                                      name: "Oriental Insurance Company",
                                                      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=80",
                                                      order: 8,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-i9",
                                                      name: "United India Insurance Co.",
                                                      imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&auto=format&fit=crop&q=80",
                                                      order: 9,
                                                      enabled: true
                                                }
                                          ]
                                    },
                                    {
                                          id: "acc-item-tpa",
                                          title: "TPA's (Third Party Administrator)",
                                          contentType: "logo_grid",
                                          enabled: true,
                                          logos: [
                                                {
                                                      id: "logo-t1",
                                                      name: "Medi Assist Insurance TPA",
                                                      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&auto=format&fit=crop&q=80",
                                                      order: 1,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-t2",
                                                      name: "Paramount Health Services & Insurance TPA",
                                                      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80",
                                                      order: 2,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-t3",
                                                      name: "MDIndia Health Insurance TPA",
                                                      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=300&auto=format&fit=crop&q=80",
                                                      order: 3,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-t4",
                                                      name: "Vidal Health Insurance TPA",
                                                      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80",
                                                      order: 4,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-t5",
                                                      name: "Heritage Health Insurance TPA",
                                                      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80",
                                                      order: 5,
                                                      enabled: true
                                                },
                                                {
                                                      id: "logo-t6",
                                                      name: "Raksha Health Insurance TPA",
                                                      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80",
                                                      order: 6,
                                                      enabled: true
                                                }
                                          ]
                                    }
                              ],
                              items: [],
                              steps: [],
                              cards: [],
                              galleryImages: [],
                              faqs: [],
                              settings: {}
                        }
                  ]
            },
            {
                  id: "tab-pc3-2",
                  title: "Cashless Claim Process",
                  type: "steps",
                  order: 2,
                  enabled: true,
                  content: "",
                  steps: [
                        {
                              step: 1,
                              title: "Pre-Authorization Request",
                              description: "Submit TPA / Health Insurance card and pre-authorization request form 48 hours prior for planned admission, or within 24 hours of emergency admission."
                        },
                        {
                              step: 2,
                              title: "Insurer Approval",
                              description: "TPA/Insurance provider verifies coverage and sends initial approval amount."
                        },
                        {
                              step: 3,
                              title: "Final Bill Settlement",
                              description: "Upon discharge, final bill and medical records are sent to TPA for final authorization."
                        }
                  ],
                  items: [],
                  cards: [],
                  galleryImages: [],
                  faqs: [],
                  sections: [
                        {
                              id: "sec-cashless-steps",
                              title: "Cashless Claim Workflow",
                              type: "steps",
                              order: 1,
                              enabled: true,
                              content: "",
                              items: [],
                              steps: [
                                    {
                                          step: 1,
                                          title: "Pre-Authorization Request",
                                          description: "Submit TPA / Health Insurance card and pre-authorization request form 48 hours prior for planned admission, or within 24 hours of emergency admission."
                                    },
                                    {
                                          step: 2,
                                          title: "Insurer Approval",
                                          description: "TPA/Insurance provider verifies coverage and sends initial approval amount."
                                    },
                                    {
                                          step: 3,
                                          title: "Final Bill Settlement",
                                          description: "Upon discharge, final bill and medical records are sent to TPA for final authorization."
                                    }
                              ],
                              cards: [],
                              galleryImages: [],
                              faqs: [],
                              settings: {}
                        }
                  ]
            },
            {
                  id: "tab-pc3-3",
                  title: "TPA & Helpdesk Assistance",
                  type: "rich_text",
                  order: 3,
                  enabled: true,
                  content: "<p>The dedicated TPA and Cashless Insurance Helpdesk at Bhaktivedanta Hospital is operational 24/7 on Ground Floor. Our team assists patients with query resolution, pre-authorization, query documentation, and final settlement with insurance providers.</p>",
                  steps: [],
                  items: [],
                  cards: [],
                  galleryImages: [],
                  faqs: [],
                  sections: [
                        {
                              id: "sec-cashless-overview",
                              title: "TPA Desk Assistance",
                              type: "rich_text",
                              order: 1,
                              enabled: true,
                              content: "<p>The dedicated TPA and Cashless Insurance Helpdesk at Bhaktivedanta Hospital is operational 24/7 on Ground Floor. Our team assists patients with query resolution, pre-authorization, query documentation, and final settlement with insurance providers.</p>",
                              items: [],
                              steps: [],
                              cards: [],
                              galleryImages: [],
                              faqs: [],
                              settings: {}
                        }
                  ]
            }
      ]
},
    {
      id: 'pc-4',
      categoryId: 'cat-discharge',
      category: 'Discharge Process',
      title: 'Discharge Procedure & Post-Care Guidelines',
      slug: 'discharge-procedure-post-care',
      shortDescription: 'Step-by-step discharge workflow, summary handover, take-home medication instructions, and follow-up consultation planning.',
      bannerImage: '',
      status: 'Published',
      displayOrder: 4,
      adminId: 'ADM-001',
      adminName: 'Super Administrator',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-01T10:00:00.000Z',
      tabs: [
        {
          id: 'tab-pc4-1',
          title: 'Discharge Workflow',
          type: 'steps',
          order: 1,
          enabled: true,
          content: '',
          steps: [
            { step: 1, title: 'Doctor Clearance', description: 'Treating consultant certifies patient readiness for discharge and prepares discharge summary.' },
            { step: 2, title: 'Billing Clearance', description: 'Pharmacy and ward supplies clearance sent to billing desk for final invoice generation.' },
            { step: 3, title: 'Medication Counseling', description: 'Pharmacist and nurse explain discharge medications, dosage schedules, and dietary restrictions.' },
            { step: 4, title: 'Discharge Summary Handover', description: 'Handover of discharge summary, investigation reports, and follow-up appointment date.' }
          ],
          items: [],
          cards: [],
          galleryImages: [],
          faqs: [],
          sections: [
            {
              id: 'sec-disch-steps',
              title: 'Step-by-Step Discharge',
              type: 'steps',
              order: 1,
              enabled: true,
              content: '',
              items: [],
              steps: [
                { step: 1, title: 'Doctor Clearance', description: 'Treating consultant certifies patient readiness for discharge and prepares discharge summary.' },
                { step: 2, title: 'Billing Clearance', description: 'Pharmacy and ward supplies clearance sent to billing desk for final invoice generation.' },
                { step: 3, title: 'Medication Counseling', description: 'Pharmacist and nurse explain discharge medications, dosage schedules, and dietary restrictions.' },
                { step: 4, title: 'Discharge Summary Handover', description: 'Handover of discharge summary, investigation reports, and follow-up appointment date.' }
              ],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            }
          ]
        },
        {
          id: 'tab-pc4-2',
          title: 'Post-Discharge Checklist',
          type: 'checklist',
          order: 2,
          enabled: true,
          content: '',
          steps: [],
          items: [
            { text: 'Receive original discharge summary signed by the treating doctor', checked: true, note: 'Essential' },
            { text: 'Collect all diagnostic reports, X-rays, and MRI films', checked: true, note: 'Original records' },
            { text: 'Collect prescribed discharge medications from hospital pharmacy', checked: true, note: 'Medications' },
            { text: 'Note follow-up OPD appointment schedule and emergency contact number', checked: true, note: 'Continuity of care' }
          ],
          cards: [],
          galleryImages: [],
          faqs: [],
          sections: [
            {
              id: 'sec-disch-checklist',
              title: 'Departure Verification',
              type: 'checklist',
              order: 1,
              enabled: true,
              content: '',
              items: [
                { text: 'Receive original discharge summary signed by the treating doctor', checked: true, note: 'Essential' },
                { text: 'Collect all diagnostic reports, X-rays, and MRI films', checked: true, note: 'Original records' },
                { text: 'Collect prescribed discharge medications from hospital pharmacy', checked: true, note: 'Medications' },
                { text: 'Note follow-up OPD appointment schedule and emergency contact number', checked: true, note: 'Continuity of care' }
              ],
              steps: [],
              cards: [],
              galleryImages: [],
              faqs: [],
              settings: {}
            }
          ]
        }
      ]
    }
  ]
};

export const TAB_TYPES = {
  RICH_TEXT: 'rich_text',
  STEPS: 'steps',
  CHECKLIST: 'checklist',
  LIST: 'list',
  CARDS: 'cards',
  GALLERY: 'gallery',
  FAQ: 'faq',
  TESTIMONIALS: 'testimonials'
};

export const SECTION_TYPES = {
  RICH_TEXT: 'rich_text',
  FEATURE_LIST: 'feature_list',
  ACCORDION: 'accordion',
  STEPS: 'steps',
  CARDS: 'cards',
  CHECKLIST: 'checklist',
  GALLERY: 'gallery',
  FAQ: 'faq',
  TABLE: 'table'
};

export function ensureStandardPatientCornerTabs(guide) {
  const standardTabs = [
    {
      id: 't1',
      title: 'Overview',
      type: 'rich_text',
      order: 1,
      enabled: true,
      content: `<p>Welcome to ${guide.title || 'Patient Guide'}. Please refer to the guidelines below.</p>`,
      steps: [],
      items: [],
      cards: [],
      galleryImages: [],
      faqs: [],
      sections: [
        {
          id: 'sec-std-overview',
          title: 'Overview',
          type: 'rich_text',
          order: 1,
          enabled: true,
          content: `<p>Welcome to ${guide.title || 'Patient Guide'}. Please refer to the guidelines below.</p>`,
          items: [],
          steps: [],
          cards: [],
          galleryImages: [],
          faqs: [],
          settings: {}
        }
      ]
    },
    {
      id: 't2',
      title: 'Important Guidelines',
      type: 'checklist',
      order: 2,
      enabled: true,
      content: '',
      steps: [],
      items: [
        { text: 'Please carry valid government photo identification and relevant medical records.', checked: true, note: 'Important' }
      ],
      cards: [],
      galleryImages: [],
      faqs: [],
      sections: [
        {
          id: 'sec-std-guidelines',
          title: 'Essential Guidelines',
          type: 'checklist',
          order: 1,
          enabled: true,
          content: '',
          items: [
            { text: 'Please carry valid government photo identification and relevant medical records.', checked: true, note: 'Important' }
          ],
          steps: [],
          cards: [],
          galleryImages: [],
          faqs: [],
          settings: {}
        }
      ]
    }
  ];

  if (!guide.tabs || guide.tabs.length === 0) {
    guide.tabs = standardTabs;
  }

  guide.tabs.forEach(tab => {
    if (!Array.isArray(tab.sections)) {
      tab.sections = [];
    }
  });
}

defaultPatientCornerState.guides.forEach(ensureStandardPatientCornerTabs);

export const defaultCareerJobs = [
  {
    id: 'JOB-101',
    category: 'Consultant Vacancy',
    title: 'Interventional Radiologist',
    department: 'Radiology & Imaging',
    positions: '01',
    qualification: 'DNB (Radio Diagnosis), Fellowship in Interventional Radiology',
    experience: '2-3 years of relevant experience',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Seeking a skilled Interventional Radiologist with experience in vascular and non-vascular interventions, fluoroscopy, and CT-guided procedures.',
    postedDate: '2026-08-15'
  },
  {
    id: 'JOB-102',
    category: 'Consultant Vacancy',
    title: 'Consultant Cardiologist',
    department: 'Cardiology',
    positions: '02',
    qualification: 'DM / DNB (Cardiology)',
    experience: '3-5 years of post-DM/DNB experience in clinical & interventional cardiology',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Full-time consultant required for our cardiac catheterization lab, echo cardiology, and OPD/IPD consultations.',
    postedDate: '2026-08-18'
  },
  {
    id: 'JOB-103',
    category: 'Nursing Vacancy',
    title: 'Senior Staff Nurse (ICU & Critical Care)',
    department: 'Critical Care / ICU',
    positions: '08',
    qualification: 'B.Sc Nursing / GNM with MNC registration',
    experience: '2+ years in Intensive Care Unit / Cardiac ICU',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Dedicated nursing professionals to deliver compassionate, skilled bedside care to critically ill patients.',
    postedDate: '2026-08-20'
  },
  {
    id: 'JOB-104',
    category: 'Nursing Vacancy',
    title: 'Staff Nurse (Operation Theatre - OT)',
    department: 'Operation Theatre',
    positions: '04',
    qualification: 'B.Sc Nursing / GNM with MNC registration',
    experience: '1-3 years of OT experience in multi-speciality setup',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Assisting surgical teams across Orthopedic, Cardiac, General Laparoscopic, and ENT surgical interventions.',
    postedDate: '2026-08-22'
  },
  {
    id: 'JOB-105',
    category: 'Paramedical Vacancy',
    title: 'Medical Laboratory Technologist (Pathology)',
    department: 'Pathology & Blood Bank',
    positions: '03',
    qualification: 'B.Sc / M.Sc in Medical Laboratory Technology (MLT)',
    experience: '1+ year experience in automated biochemistry and hematology',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Operating advanced hematology and biochemistry analyzers under NABL accredited quality guidelines.',
    postedDate: '2026-08-25'
  },
  {
    id: 'JOB-106',
    category: 'Paramedical Vacancy',
    title: 'Clinical Pharmacist',
    department: 'Pharmacy',
    positions: '03',
    qualification: 'B.Pharm / Pharm.D with State Pharmacy Council registration',
    experience: '1-2 years in hospital IPD/OPD dispensing',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Medication reconciliation, IPD prescription review, patient counselling, and inventory oversight.',
    postedDate: '2026-08-28'
  },
  {
    id: 'JOB-107',
    category: 'Admin & Support Vacancy',
    title: 'Patient Care Coordinator (Helpdesk & Admission)',
    department: 'Front Office & Guest Relations',
    positions: '04',
    qualification: 'Any Graduate / Healthcare Administration diploma',
    experience: '1-3 years in hospital reception, billing or patient coordination',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Welcoming patients, managing admission procedures, insurance coordination, and addressing patient queries.',
    postedDate: '2026-09-01'
  }
];

export const defaultCareerApplications = [
  {
    id: 'APP-1001',
    jobId: 'JOB-101',
    position: 'Interventional Radiologist',
    fullName: 'Dr. Rohan Deshmukh',
    email: 'rohan.deshmukh@gmail.com',
    phone: '+91 98201 44521',
    qualification: 'DNB (Radio Diagnosis)',
    experience: '3.5 Years',
    currentCtc: '22 LPA',
    expectedCtc: '28 LPA',
    noticePeriod: '30 Days',
    city: 'Mumbai',
    resumeUrl: 'https://example.com/resumes/rohan_deshmukh_cv.pdf',
    resumeName: 'Dr_Rohan_Deshmukh_CV.pdf',
    coverNote: 'Experienced in peripheral and neurovascular interventions with fellowship from KEM Hospital.',
    status: 'Shortlisted',
    appliedDate: '2026-09-02',
    hrNotes: 'Credentials verified with MMC. Scheduled preliminary interview with HOD Radiology for next Tuesday.'
  },
  {
    id: 'APP-1002',
    jobId: 'JOB-103',
    position: 'Senior Staff Nurse (ICU & Critical Care)',
    fullName: 'Sneha Mary Varghese',
    email: 'sneha.varghese@yahoo.com',
    phone: '+91 97692 88123',
    qualification: 'B.Sc Nursing (MNC Reg: 148922)',
    experience: '4 Years',
    currentCtc: '4.2 LPA',
    expectedCtc: '5.5 LPA',
    noticePeriod: '15 Days',
    city: 'Thane',
    resumeUrl: 'https://example.com/resumes/sneha_varghese_cv.pdf',
    resumeName: 'Sneha_Varghese_Resume.pdf',
    coverNote: 'Over 4 years of solid experience handling ventilator patients, arterial lines, and post-CABG cardiac monitoring.',
    status: 'Under Review',
    appliedDate: '2026-09-05',
    hrNotes: 'Good experience in tertiary hospital ICU. Nursing Superintendent to review shift availability.'
  },
  {
    id: 'APP-1003',
    jobId: 'JOB-106',
    position: 'Clinical Pharmacist',
    fullName: 'Amitesh Patil',
    email: 'amitesh.patil@outlook.com',
    phone: '+91 91370 55670',
    qualification: 'Pharm.D',
    experience: '2 Years',
    currentCtc: '3.6 LPA',
    expectedCtc: '4.8 LPA',
    noticePeriod: 'Immediate',
    city: 'Mumbai',
    resumeUrl: 'https://example.com/resumes/amitesh_patil_cv.pdf',
    resumeName: 'Amitesh_Patil_PharmD.pdf',
    coverNote: 'Keen interest in antibiotic stewardship, clinical medication charting and NABH pharmacy documentation.',
    status: 'New',
    appliedDate: '2026-09-10',
    hrNotes: ''
  }
];


export const defaultEducationResearchState = {
  "title": "DNB Program",
  "heroIntro": "Bhaktivedanta Hospital & Research Institute successfully conducts post graduate and post-doctoral courses in various medical and allied specialities and super specialities to create high quality healthcare professionals. We currently offer DNB programs in Medicine, Paediatric, Radiology, Ophthalmology, Obstetrics & Gynaecology, Urology & Anesthesiology. Our teaching faculty includes senior and experienced doctors who help students gain knowledge of specialities and sub-specialities practically and theoretically. Our teaching programme includes case presentations, seminars, grand round presentations by departments and sub-specialties, clinical audit, conference and many more. In addition to existing DNB programs, we would be adding Cardiology soon.",
  "quote": "Our institute is one of the best DNB colleges in Maharashtra state. Our program aims to thoroughly equip DNB students to provide preventive, promotive, curative and rehabilitative medical care in their respective specialties.",
  "directorVideo": {
    "title": "From the Director's Desk | DNB Program at Bhaktivedanta Hospital & Research Institute",
    "embedUrl": "https://www.youtube.com/embed/cSSpKTRgR2Q"
  },
  "seatsMatrix": [
    {
      "id": 1,
      "specialty": "DNB General Medicine",
      "seats": 2
    },
    {
      "id": 2,
      "specialty": "DNB Paediatrics",
      "seats": 3
    },
    {
      "id": 3,
      "specialty": "DNB Ophthalmology",
      "seats": 4
    },
    {
      "id": 4,
      "specialty": "DNB Obstetrics & Gynaecology",
      "seats": 2
    },
    {
      "id": 5,
      "specialty": "Diploma in Radio Diagnosis",
      "seats": 2
    },
    {
      "id": 6,
      "specialty": "DNB Urology",
      "seats": 1
    },
    {
      "id": 7,
      "specialty": "DNB Anesthesiology",
      "seats": 2
    }
  ],
  "specialities": [
    {
      "id": "dnb-gm",
      "title": "DNB General Medicine",
      "seats": 2,
      "about": "The Department of Internal Medicine at the Bhaktivedanta Hospital & Research Institute believes in treating each patient uniquely by harmonizing mainstream medical protocols along with a variety of other scientifically testified modalities to bring about maximum curative, promotive and rehabilitative transformation in the patient’s medical condition. Experience has shown that this integrative approach is not only more acceptable by the patients but also more satisfying in the disease outcome. This is true especially for complicated multiorgan disorders and chronic conditions.",
      "aboutHighlight": "Our department comprises a good blend of young physicians with academic excellence along with senior physicians who have rich clinical experience of over 30 years. Our physicians address every patient concern as well as provide comprehensive care to IPD patients suffering from a broad range of ailments.",
      "integratedMedicine": "At our facility, we pride ourselves on offering integrated medicine, a holistic approach that centers around the well-being of the whole person rather than merely addressing specific illnesses. Integrated Medicine (IM) recognizes the intricate connection between physical, mental, emotional, and spiritual aspects, advocating for evidence-based alternative modalities like Ayurveda, Yoga, and Nutrition alongside conventional medical therapies.",
      "faculties": [
        {
          "name": "Dr. Dhaval Dalal",
          "designation": "HOD of Internal Medicine & Senior Consultant Internal Medicine",
          "qualification": "MD (Internal Medicine)",
          "experience": "32 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684020335156.png"
        },
        {
          "name": "Dr. Suraj Purushotthaman",
          "designation": "Consultant Physician & Intensivist",
          "qualification": "MD (General Medicine)",
          "experience": "12 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684020608010.png"
        },
        {
          "name": "Dr. Ajay Shankhe",
          "designation": "Director & Senior Consultant",
          "qualification": "MD (Medicine), DNB",
          "experience": "30 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16923328479408.png"
        },
        {
          "name": "Dr. Nikhil Raut",
          "designation": "Consultant Pulmonologist & Critical Care Specialist",
          "qualification": "DNB (Respiratory Diseases), FCCP",
          "experience": "14 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684021079177.png"
        }
      ],
      "academicSchedule": [
        {
          "day": "Monday",
          "schedule": "Bedside Clinics & Basic Ward Rounds"
        },
        {
          "day": "Tuesday",
          "schedule": "Intra-departmental Meet, Grand Rounds & Case Presentation"
        },
        {
          "day": "Wednesday",
          "schedule": "Faculty Teaching, Central Session, Guest Lecture & Clinical Audit"
        },
        {
          "day": "Thursday",
          "schedule": "Basic Rounds, Critical Care Symposia & Mortality Meet"
        },
        {
          "day": "Friday",
          "schedule": "Journal Club & Seminar Symposia"
        },
        {
          "day": "Saturday",
          "schedule": "Thesis Update, Skills Lab & Interventional Procedures"
        }
      ],
      "videos": [
        "https://www.youtube.com/embed/4kpZUG9pJfU",
        "https://www.youtube.com/embed/UoTDwm14bg0"
      ]
    },
    {
      "id": "dnb-paed",
      "title": "DNB Paediatrics",
      "seats": 3,
      "about": "The Department of Pediatrics at the Bhaktivedanta Hospital & Research Institute was started on 11 Jan 1998 under the leadership of Dr. Ajay Sankhe. Over the years, the department has grown into a comprehensive child healthcare center providing tertiary-level neonatal care (Level III NICU), pediatric intensive care (PICU), and a full spectrum of pediatric sub-specialties.",
      "aboutHighlight": "The department features state-of-the-art Level III NICU with advanced multi-parameter monitors, conventional and high-frequency ventilators, nitric oxide therapy, LED phototherapy units, and specialized neonatology transport.",
      "integratedMedicine": "Pediatric sub-specialties include Pediatric Cardiology, Pediatric Nephrology, Pediatric Neurology, Developmental Pediatrics, Genetic Clinic, and Child Guidance Clinic ensuring integrated developmental well-being.",
      "faculties": [
        {
          "name": "Dr. Ajay Sankhe",
          "designation": "Director of Hospital, Pediatrician & Neonatologist",
          "qualification": "MD (Pediatrics)",
          "experience": "34 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16779476303741.png"
        },
        {
          "name": "Dr. Girish Patel",
          "designation": "Senior Consultant Pediatrician & Neonatologist",
          "qualification": "MD (Pediatrics), DNB",
          "experience": "22 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16779476415699.png"
        },
        {
          "name": "Dr. Mayur Agarwal",
          "designation": "Consultant Pediatric Intensivist",
          "qualification": "MD, Fellowship in PICU",
          "experience": "11 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16779476625691.png"
        }
      ],
      "academicSchedule": [
        {
          "day": "Monday",
          "schedule": "NICU / PICU Bedside Clinical Teaching"
        },
        {
          "day": "Tuesday",
          "schedule": "Pediatric Case Discussion & OSCE Training"
        },
        {
          "day": "Wednesday",
          "schedule": "Pediatric Sub-specialty Clinic & Faculty Lecture"
        },
        {
          "day": "Thursday",
          "schedule": "Grand Rounds & Neonatal Resuscitation Drill"
        },
        {
          "day": "Friday",
          "schedule": "Journal Club & Research Methodology"
        },
        {
          "day": "Saturday",
          "schedule": "Clinical Seminar & Procedural Skill Workshop"
        }
      ]
    },
    {
      "id": "dnb-ophthalmology",
      "title": "DNB Ophthalmology",
      "seats": 4,
      "about": "The Eye Care Centre at Bhaktivedanta Hospital & Research Institute (Lions Juhu Aruna Abhey Oswal Super Speciality Eye Centre) is equipped with advanced technology for diagnostic, refractive, surgical, and therapeutic eye care. It conducts extensive cataract surgeries, vitreo-retinal procedures, corneal transplants, glaucoma management, and pediatric ophthalmology.",
      "aboutHighlight": "The residency program emphasizes high surgical volume hands-on phacoemulsification training, retinal laser therapies, keratoplasty, and extensive community outreach eye camps in rural Maharashtra.",
      "integratedMedicine": "Comprehensive vision rehabilitation, eye yoga, and preventive community ophthalmology are integrated into daily clinical training.",
      "faculties": [
        {
          "name": "Dr. Suraj Prakash Bhagde",
          "designation": "HOD & Senior Consultant Eye Care",
          "qualification": "MBBS, MS (Ophthalmology)",
          "experience": "24 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684949258105.png"
        },
        {
          "name": "Dr. S. K. Narang",
          "designation": "Senior Consultant Vitreo-Retina & Cataract",
          "qualification": "MS, DNB, FICO",
          "experience": "20 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684949707082.png"
        }
      ],
      "academicSchedule": [
        {
          "day": "Monday",
          "schedule": "OPD Clinical Evaluation & Slit Lamp Skills"
        },
        {
          "day": "Tuesday",
          "schedule": "OT Hands-on Surgical Training (Phaco & SICS)"
        },
        {
          "day": "Wednesday",
          "schedule": "Vitreo-Retina & Cornea Sub-specialty Rounds"
        },
        {
          "day": "Thursday",
          "schedule": "Case Presentation & Refraction Practice"
        },
        {
          "day": "Friday",
          "schedule": "Journal Club & Community Field Screening Review"
        },
        {
          "day": "Saturday",
          "schedule": "Surgical Video Review & Wet Lab Procedures"
        }
      ]
    },
    {
      "id": "dnb-obgyn",
      "title": "DNB Obstetrics & Gynaecology",
      "seats": 2,
      "about": "The Department of Obstetrics & Gynaecology offers round-the-clock comprehensive care for expectant mothers, high-risk pregnancies, gynecological oncology, endoscopic surgeries (laparoscopy & hysteroscopy), and adolescent gynecology.",
      "aboutHighlight": "Equipped with state-of-the-art labor rooms, dedicated maternity OT, fetal medicine scanning, and seamless integration with Level III NICU for high-risk maternal-fetal outcomes.",
      "integratedMedicine": "Garbha Sanskar, prenatal spiritual care, maternal yoga, and holistic lifestyle mentorship are uniquely imparted to residents alongside modern obstetrics protocols.",
      "faculties": [
        {
          "name": "Dr. Veena Sankhe",
          "designation": "Senior Consultant Obstetrician & Gynecologist",
          "qualification": "MD, DGO, FCPS",
          "experience": "30 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684030714837.png"
        },
        {
          "name": "Dr. Sujata Dalal",
          "designation": "Consultant Laparoscopic Surgeon & Gynecologist",
          "qualification": "MS (OBGYN), Fellowship in Endoscopy",
          "experience": "22 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684021843703.png"
        }
      ],
      "academicSchedule": [
        {
          "day": "Monday",
          "schedule": "Antenatal & High-Risk Pregnancy Clinics"
        },
        {
          "day": "Tuesday",
          "schedule": "Major Gynecological Laparoscopic Surgery OT"
        },
        {
          "day": "Wednesday",
          "schedule": "Faculty Clinical Lecture & CTG Tracing Rounds"
        },
        {
          "day": "Thursday",
          "schedule": "Obstetric Emergency Drills & Grand Rounds"
        },
        {
          "day": "Friday",
          "schedule": "Journal Club & Perinatal Mortality Audit"
        },
        {
          "day": "Saturday",
          "schedule": "Colposcopy & Pelvic Floor Ultrasound Workshop"
        }
      ]
    },
    {
      "id": "dnb-urology",
      "title": "DNB Urology",
      "seats": 1,
      "about": "The Urology Centre at Bhaktivedanta Hospital & Research Institute is a super-speciality centre of excellence with cutting-edge endourology, laser prostate enucleation (HoLEP/ThuLEP), flexible ureteroscopy (RIRS), laparoscopic urological oncology, and renal transplantation.",
      "aboutHighlight": "Residents gain extensive hands-on operative experience with high definition laparoscopy, holmium laser suites, and comprehensive stone clinic management with lithotripsy.",
      "integratedMedicine": "Holistic management of chronic pelvic pain, recurrent urolithiasis dietary prevention, and lifestyle modifications complement modern uro-surgical care.",
      "faculties": [
        {
          "name": "Dr. Shirish Yande",
          "designation": "Director & Senior Consultant Urologist",
          "qualification": "MS, M.Ch (Urology), DNB",
          "experience": "28 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684021592797.png"
        },
        {
          "name": "Dr. Samit Doshi",
          "designation": "Consultant Endourologist & Andrologist",
          "qualification": "DNB (Urology)",
          "experience": "8 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Samit Doshi.png"
        }
      ],
      "academicSchedule": [
        {
          "day": "Monday",
          "schedule": "Endourology OT & Urodynamic Study Clinics"
        },
        {
          "day": "Tuesday",
          "schedule": "Bedside Urological Rounds & Pre-op Planning"
        },
        {
          "day": "Wednesday",
          "schedule": "Faculty Didactic Lecture & Stone Registry Review"
        },
        {
          "day": "Thursday",
          "schedule": "Advanced Laparoscopic / Transplant OT"
        },
        {
          "day": "Friday",
          "schedule": "Journal Club & Urological Oncology Meet"
        },
        {
          "day": "Saturday",
          "schedule": "Morbidity & Mortality Audit & Simulation Skills"
        }
      ]
    },
    {
      "id": "dnb-anaesthesia",
      "title": "DNB Anaesthesiology",
      "seats": 2,
      "about": "Recognized by the National Board of Examinations in Medical Sciences, the Department of Anaesthesiology manages high-volume peri-operative care across 8 modular operating theatres, acute pain management services, difficult airway management, and critical care units.",
      "aboutHighlight": "Residents are thoroughly trained in ultrasound-guided regional nerve blocks, invasive arterial and central venous monitoring, neuro-anaesthesia, pediatric anaesthesia, and onco-surgical resuscitation.",
      "integratedMedicine": "Residents also learn holistic pain relief protocols, patient mindfulness calming techniques, and post-operative music and spiritual comfort modalities.",
      "faculties": [
        {
          "name": "Dr. Nilesh Patel",
          "designation": "HOD & Senior Consultant Anaesthesiologist",
          "qualification": "MD (Anaesthesia), DA",
          "experience": "25 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684021338506.png"
        },
        {
          "name": "Dr. Pratibha Dalal",
          "designation": "Senior Consultant Neuro & Onco Anaesthetist",
          "qualification": "MD (Anaesthesiology)",
          "experience": "22 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16684021843703.png"
        }
      ],
      "academicSchedule": [
        {
          "day": "Monday",
          "schedule": "Pre-Anaesthetic Check-up (PAC) Clinic & Rounds"
        },
        {
          "day": "Tuesday",
          "schedule": "Modular OT Anaesthetic Management"
        },
        {
          "day": "Wednesday",
          "schedule": "Ultrasound Guided Nerve Block Workshop"
        },
        {
          "day": "Thursday",
          "schedule": "Difficult Airway Management Simulation"
        },
        {
          "day": "Friday",
          "schedule": "Critical Care Case Presentation & Journal Club"
        },
        {
          "day": "Saturday",
          "schedule": "Mortality & Incident Audit & Equipment Check"
        }
      ]
    },
    {
      "id": "dnb-radiology",
      "title": "Diploma in Radio Diagnosis",
      "seats": 2,
      "about": "The Department of Radiology at Bhaktivedanta Hospital & Research Institute offers a wide range of advanced diagnostic and interventional imaging modalities, featuring 1.5 Tesla MRI, 128-slice Multidetector CT, 3D/4D Ultrasound, Color Doppler, Digital Mammography, and Digital Radiography.",
      "aboutHighlight": "Residents undergo systematic rotation through Neuroradiology, Abdominal Imaging, Musculoskeletal MRI, Fetal Medicine, and Vascular Interventional Radiology procedures.",
      "integratedMedicine": "Emphasis on low-radiation ALARA protocols, empathetic patient communication, and multidisciplinary radiological-pathological correlative meetings.",
      "faculties": [
        {
          "name": "Dr. Rajesh Sharma",
          "designation": "HOD & Senior Consultant Radiologist",
          "qualification": "MD (Radio Diagnosis)",
          "experience": "26 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/1677947650714.png"
        },
        {
          "name": "Dr. Snehal Vaidya",
          "designation": "Consultant Radiologist & Cross-Sectional Imaging Specialist",
          "qualification": "DNB (Radio Diagnosis)",
          "experience": "14 years+",
          "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/experts/16779476842063.png"
        }
      ],
      "academicSchedule": [
        {
          "day": "Monday",
          "schedule": "CT Scan Case Reporting & Protocolling"
        },
        {
          "day": "Tuesday",
          "schedule": "MRI Physics & Neuro-Imaging Review"
        },
        {
          "day": "Wednesday",
          "schedule": "Ultrasound & Interventional Biopsy Procedures"
        },
        {
          "day": "Thursday",
          "schedule": "Clinico-Radiological Multidisciplinary Conference"
        },
        {
          "day": "Friday",
          "schedule": "Journal Club & Spotter Quiz Sessions"
        },
        {
          "day": "Saturday",
          "schedule": "Emergency Radiology Rounds & Audit"
        }
      ]
    }
  ],
  "facilities": [
    {
      "title": "Classroom",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/classroom 1.jpg",
      "caption": "Smart audio-visual enabled lecture room for interactive clinical seminars"
    },
    {
      "title": "Library",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Library.jpg",
      "caption": "Extensive repository of indexed medical textbooks and international journals"
    },
    {
      "title": "Library & Reading Room",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Library 1.jpg",
      "caption": "Quiet dedicated study cubicles open round-the-clock for post-graduate students"
    },
    {
      "title": "Canteen",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Canteen.jpg",
      "caption": "Wholesome, hygienic, vegetarian dining providing nutritious meals for staff & students"
    },
    {
      "title": "Dining Hall",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Canteen1.jpg",
      "caption": "Spacious dining facility with fresh hygienic catering throughout the day"
    },
    {
      "title": "Resident Hostel",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Hostel.jpg",
      "caption": "Well-furnished on-campus accommodation with security and high-speed Wi-Fi"
    },
    {
      "title": "Hostel Rooms",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Hostel2.jpg",
      "caption": "Comfortable living spaces equipped for medical residents and fellows"
    },
    {
      "title": "Lecture Theatre",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Lecture theatre.jpg",
      "caption": "Tiered seating lecture theatre for hospital-wide clinical academic meetings"
    },
    {
      "title": "Lecture Theatre 2",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Lecture theatre1.jpg.jpg",
      "caption": "Equipped with dual projectors and live broadcast capability for surgical workshops"
    },
    {
      "title": "Auditorium",
      "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Auditorium.jpg",
      "caption": "Large state-of-the-art auditorium hosting national conferences and symposiums"
    }
  ],
  "digitalLibrary": {
    "title": "Digital Library",
    "image": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/library.jpg",
    "description": "Our Digital Library provides high-speed internet workstations with subscriptions to major international biomedical databases, PubMed Central, UpToDate, ScienceDirect, and the National Medical Library e-consortium."
  },
  "cmeList2023": [
    "CME on Chronic Obstructive Pulmonary Diseases (COPD)",
    "CME on Growth, Obesity, Thyroid & Osteoporosis (GOTO) Update",
    "CME on Medico-legal Aspects of Anesthesiology",
    "CME on NRP Course Advance (Neonatal Resuscitation Program)",
    "CME on Kidney Transplant Update 2023",
    "CME on Case Presentation on Paediatrics Dilemma",
    "CME on GOTO National Conference",
    "CME on PulmoSleep Diagnostic Update",
    "CME on Genetics & Genetic Counselling in Clinical Practice",
    "CME on Critical Care & Infectious Disease Symposium (Pfizer Forth)",
    "CME on Latest Trends in High-Risk Pregnancy & Delivery",
    "CME on Acute Coronary Syndrome Conclave",
    "CME on Pediatric Emergencies & Resuscitation Updates",
    "CME on Chronic Kidney Disease Update for Primary Physicians",
    "CME on Urolithiasis & Endourological Updates",
    "CME on Critical Care & Multi-Drug Resistant Infections"
  ],
  "testimonials": {
    "video": "https://www.youtube.com/embed/CEbtKtiDW-o",
    "achievements": [
      {
        "id": 1,
        "studentName": "Dr. Makbool Ali Agharia",
        "photo": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/photo.png",
        "certificate": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/certificate.png",
        "award": "Won 3rd Prize for Poster Presentation at Nephrology Semiweek Conference held on 7th – 9th July, 2023"
      },
      {
        "id": 2,
        "studentName": "Dr. Samit Doshi",
        "photo": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Samit Doshi.png",
        "certificate": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Samit Doshi certificate.png",
        "award": "Won 2nd Prize in Bi-Monthly Scientific Meeting of Mumbai Urological Society held on 25th February 2024"
      }
    ]
  },
  "research": {
    "overview": "The research activities of the institute are supported and managed by the Medical Research Department. It provides guidance, administrative and managerial support for all kinds of research undertaken by the institute (clinical trials, Investigator Initiated studies, DNB thesis, and high-impact publications). The department also facilitates interaction with external agencies, both at national and international levels. It promotes institute-industry interactions, externally funded research and development projects, as well as patents and IP rights. The department is a state-of-the-art facility which undertakes and promotes ethical research projects for better healthcare outcomes.",
    "pillars": [
      {
        "title": "Biomedical & Health Research",
        "desc": "Translational clinical investigations and preventive health protocols"
      },
      {
        "title": "Clinical Trials (Phase II-IV)",
        "desc": "International and domestic GCP-compliant clinical drug and device trials"
      },
      {
        "title": "Ethics Committee Oversight",
        "desc": "Registered with CDSCO and DHR for biomedical and health research"
      },
      {
        "title": "Post Graduate Academic Thesis",
        "desc": "Rigorous epidemiological thesis training for every DNB resident"
      }
    ],
    "publications": [
      {
        "sr": 1,
        "citation": "Noronha V, Dikshit R, Raut N, Joshi A, Pramesh CS, George K, et al.",
        "title": "Epidemiology of lung cancer in India: focus on the differences between non-smokers and smokers",
        "year": "2012",
        "journal": "Journal of Thoracic Oncology, 7(7):1135-40"
      },
      {
        "sr": 2,
        "citation": "Sankhe A, Patel G, et al.",
        "title": "Outcome of Level III Neonatal Intensive Care in a Charitable Tertiary Hospital of Suburban Mumbai",
        "year": "2019",
        "journal": "Indian Journal of Pediatrics, 86(4):342-348"
      },
      {
        "sr": 3,
        "citation": "Yande S, Doshi S, et al.",
        "title": "Comparative Efficacy of Holmium Laser Enucleation of Prostate (HoLEP) vs Transurethral Resection",
        "year": "2021",
        "journal": "Urology International, 105(2):189-195"
      },
      {
        "sr": 4,
        "citation": "Bhagde SP, Narang SK, et al.",
        "title": "Visual Outcomes and Complication Rates in High-Volume SICS in Community Eye Camps",
        "year": "2022",
        "journal": "Journal of Clinical Ophthalmology & Research, 10(1):23-29"
      }
    ],
    "ethicsCommittee": [
      {
        "sr": 1,
        "name": "Dr. Raakhi K Tripathi",
        "qualification": "MBBS, MD (Pharmacology)",
        "role": "Chairperson"
      },
      {
        "sr": 2,
        "name": "Dr. Suraj Prakash Bhagde",
        "qualification": "MBBS, MS (Ophthalmology)",
        "role": "Member Secretary"
      },
      {
        "sr": 3,
        "name": "Dr. Tejal Dalal",
        "qualification": "MD (Pathology)",
        "role": "Basic Medical Scientist"
      },
      {
        "sr": 4,
        "name": "Adv. Rameshwar Sharma",
        "qualification": "B.Com, LL.B",
        "role": "Legal Expert"
      },
      {
        "sr": 5,
        "name": "Mrs. Jayashree Kulkarni",
        "qualification": "MA (Sociology)",
        "role": "Social Scientist"
      },
      {
        "sr": 6,
        "name": "Mr. Arvind Joshi",
        "qualification": "B.Sc",
        "role": "Lay Person"
      }
    ],
    "scientificCommittee": [
      {
        "sr": 1,
        "name": "Dr. Ajay Sankhe",
        "qualification": "MD (Pediatrics)",
        "role": "Chairperson (Head of Institute)"
      },
      {
        "sr": 2,
        "name": "Dr. Siva Prasad Gourabathini",
        "qualification": "Ph.D (Life Sciences)",
        "role": "Member Secretary & Research Coordinator"
      },
      {
        "sr": 3,
        "name": "Dr. Dhaval Dalal",
        "qualification": "MD (Medicine)",
        "role": "Senior Clinical Faculty"
      },
      {
        "sr": 4,
        "name": "Dr. Shirish Yande",
        "qualification": "MS, M.Ch (Urology)",
        "role": "Surgical Academic Representative"
      }
    ]
  },
  "holisticProgram": {
    "title": "Complete Doctor Course Certificate Program (CDCC)",
    "subtitle": "Holistic Program for Doctor Leadership",
    "intro": "Along with a robust training program in clinical medicine, the founders of Bhaktivedanta Hospital & Research Institute feel morally responsible to educate students into the tenets of a holistic lifestyle. Doctors who are sturdy physically, endowed with a high emotional quotient, and grounded in a strong spiritual foundation are a decisive force to navigate society through healthcare challenges.",
    "sacredMission": "At Bhaktivedanta Hospital and Research Institute, this mentorship is not an administrative chore but a sacred mission.",
    "objectives": [
      {
        "title": "Physical Well-Being & Resilience",
        "description": "Cultivating stamina, nutritional discipline, and stress-coping regimens essential for intensive clinical careers."
      },
      {
        "title": "High Emotional Quotient (EQ)",
        "description": "Empathetic bedside manners, conflict resolution, dealing gracefully with patient grief and critical emergencies."
      },
      {
        "title": "Spiritual Foundation & Ethical Anchor",
        "description": "Internal peace, selfless service attitude (Seva Bhavana), and ethical clarity preventing physician burnout."
      },
      {
        "title": "Compassionate Patient-Centric Care",
        "description": "Treating the patient as an integrated physical, psychological, and spiritual individual rather than just a medical pathology."
      }
    ]
  },
  "nursingProgram": {
    "title": "Rosalind S. Teton School of Nursing",
    "subtitle": "Excellence in Nursing Education & Clinical Compassion",
    "badge": "Recognized by MNC & INC",
    "overview": "Rosalind S. Teton School of Nursing was established in the year 2005 under the aegis of Shri Chaitanya Health and Care Trust at Bhaktivedanta Hospital & Research Institute. The school was founded with the sacred mission to educate, train, and mold compassionate nursing professionals who blend modern clinical proficiency with genuine spiritual empathy. In 2014, the school was conferred the prestigious 'Excellence in Nursing Education' award by the Indus Foundation, USA.",
    "bannerImage": "https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/gallery/Hostel.jpg",
    "established": "2005",
    "intakeSeats": 30,
    "duration": "3 Years (Full Time)",
    "affiliation": "Maharashtra Nursing Council (MNC) & Indian Nursing Council (INC)",
    "courses": [
      {
        "name": "General Nursing & Midwifery (G.N.M.)",
        "duration": "3 Years",
        "seats": 30,
        "eligibility": "10+2 with minimum 40% aggregate marks (Science, Arts or Commerce). Registered ANM with pass marks are also eligible.",
        "description": "Comprehensive 3-year diploma imparting bedside nursing skills, anatomy, maternal-child health, community healthcare, and emergency life support."
      },
      {
        "name": "Post Basic B.Sc. Nursing (P.B.B.Sc.)",
        "duration": "2 Years",
        "seats": 20,
        "eligibility": "Passed G.N.M. diploma and registered as nurse with State Nursing Registration Council.",
        "description": "Advanced degree course upgrading registered nurses in leadership, nursing administration, research methodology, and specialized critical care."
      }
    ],
    "keyFeatures": [
      {
        "title": "Hands-on Hospital Training",
        "desc": "Direct clinical rotations inside Bhaktivedanta Hospital 100+ bedded super-speciality facility."
      },
      {
        "title": "Advanced Simulation Skills Lab",
        "desc": "Equipped with cardiopulmonary manikins, maternal-fetal models, and intravenous training arms."
      },
      {
        "title": "Holistic & Value-Based Education",
        "desc": "Unique training in compassionate communication, patient counseling, and stress-coping."
      },
      {
        "title": "100% Placement Assistance",
        "desc": "Opportunity for direct absorption in hospital departments or esteemed partner healthcare networks."
      }
    ],
    "contactInfo": {
      "campus": "Sheth P. V. Doshi Hospital, Poonam Nagar, Shanti Park, Mira Road (East), Thane - 401107",
      "phone": "8291103508 / 022 2811 0000",
      "email": "bhaktinursingschool@yahoo.co.in / nursing.school@yahoo.co.in"
    }
  },
  "cmeProgram": {
    "title": "Continuing Medical Education (CME)",
    "subtitle": "Knowledge Sharing & Clinical Skills Upgrade for Medical Practitioners",
    "overview": "Bhaktivedanta Hospital & Research Institute regularly organizes high-impact Continuing Medical Education (CME) conferences, clinical symposia, and grand rounds. All programs are accredited by the Maharashtra Medical Council (MMC), granting credit hours to attending physicians, surgeons, and postgraduate residents. Renowned national and international faculties share breakthroughs in evidence-based medicine.",
    "accreditationBadge": "Maharashtra Medical Council (MMC) Accredited",
    "totalAnnualEvents": "16+ Conferences Annually",
    "averageCreditPoints": "2 to 4 MMC Credit Hours per Event",
    "upcomingAndRecent": [
      {
        "topic": "CME on Advances in Critical Care Medicine & Sepsis Management",
        "date": "March 2024",
        "creditHours": "2 MMC Points",
        "faculty": "Dr. Nikhil Raut & Dr. Suraj Purushotthaman"
      },
      {
        "topic": "National Conclave on Chronic Obstructive Pulmonary Diseases (COPD)",
        "date": "January 2024",
        "creditHours": "3 MMC Points",
        "faculty": "Dr. Nikhil Raut"
      },
      {
        "topic": "Updates in High-Risk Obstetrics & Fetal Doppler Ultrasound",
        "date": "November 2023",
        "creditHours": "2 MMC Points",
        "faculty": "Dr. Veena Sankhe & Dr. Sujata Dalal"
      },
      {
        "topic": "Kidney Transplant & Immunosuppressive Therapy Update 2023",
        "date": "July 2023",
        "creditHours": "4 MMC Points",
        "faculty": "Dr. Shirish Yande & Dr. Samit Doshi"
      },
      {
        "topic": "GOTO National Conference (Growth, Obesity, Thyroid & Osteoporosis)",
        "date": "May 2023",
        "creditHours": "4 MMC Points",
        "faculty": "Dr. Ajay Sankhe & Department of Pediatrics"
      },
      {
        "topic": "Pediatric Emergencies & Neonatal Resuscitation Program (NRP)",
        "date": "April 2023",
        "creditHours": "2 MMC Points",
        "faculty": "Dr. Girish Patel & Dr. Mayur Agarwal"
      }
    ]
  },
  "cneProgram": {
    "title": "Continuing Nursing Education (CNE)",
    "subtitle": "Advancing Professional Competencies & Compassionate Nursing Care",
    "overview": "The Department of Nursing at Bhaktivedanta Hospital conducts specialized Continuing Nursing Education (CNE) workshops. Recognized with credit points by the Maharashtra Nursing Council (MNC), these sessions empower staff nurses, ward in-charges, and nurse educators with modern clinical protocols, patient safety standards, infection control, and empathetic bedside communication.",
    "accreditationBadge": "Maharashtra Nursing Council (MNC) Accredited",
    "eligibility": "All Registered Nurses (GNM, B.Sc, M.Sc) holding valid State Nursing Council registration",
    "focusAreas": [
      {
        "title": "Critical Care & Ventilator Nursing",
        "desc": "Invasive arterial line care, ABG interpretation, ventilator waveforms, and hemodynamic stability."
      },
      {
        "title": "Infection Prevention & NABH Bundles",
        "desc": "Central line bundle (CLABSI), catheter bundle (CAUTI), hand hygiene surveillance, and biomedical waste."
      },
      {
        "title": "Emergency Resuscitation (BLS/ACLS)",
        "desc": "High-quality CPR, defibrillation protocols, rapid response activation, and code blue simulation."
      },
      {
        "title": "Maternal-Neonatal Resuscitation",
        "desc": "Neonatal resuscitation, kangaroo mother care, phototherapy management, and lactation counseling."
      }
    ]
  },
  "spiritualCareCourse": {
    "title": "Spiritual Care Certificate Course",
    "subtitle": "Pioneering Holistic Healing for Healthcare Professionals Since 2010",
    "overview": "Introduced in 2010 by the Department of Spiritual Care, this internationally acclaimed certificate course equips doctors, nurses, and paramedical professionals to integrate spiritual well-being into modern medical practice. Recognizing that healing encompasses the physical, mental, emotional, and spiritual dimensions of human existence, the program provides comprehensive theoretical grounding and practical bedside mentorship.",
    "introducedYear": "2010",
    "duration": "6 Months (Hybrid / Weekend Modules with Hospital Practical Rotations)",
    "eligibility": "Registered Healthcare Professionals globally: MBBS/MD Doctors, AYUSH Practitioners, Nursing Officers, Medical Social Workers, and Healthcare Counselors.",
    "dimensions": [
      {
        "title": "Physical Dimension",
        "desc": "Understanding psychosomatic medicine, pain relief, and evidence-based lifestyle modifications."
      },
      {
        "title": "Emotional Dimension",
        "desc": "Cultivating emotional intelligence, handling patient grief, empathy, and mitigating physician burnout."
      },
      {
        "title": "Intellectual Dimension",
        "desc": "Bioethical principles, truth-telling in terminal diagnoses, and ethical decision-making in end-of-life care."
      },
      {
        "title": "Spiritual Dimension",
        "desc": "Spiritual assessment tools (FICA/HOPE), prayer, mindfulness, meaning-making, and eternal purpose."
      }
    ],
    "quote": "Spiritual care is not a ritual or dogma; it is addressing the deepest spiritual yearnings of hope, meaning, and love during human suffering."
  },
  "clinicalResearchCourse": {
    "title": "Post Graduate Certificate in Clinical Research (PGCR)",
    "subtitle": "15-Month Comprehensive Program with Live Hospital Campus Internship",
    "overview": "The Medical Research Department conducts the Post Graduation in Clinical Research (PGCR) program, designed to groom future leaders in clinical research and drug development. Combining classroom lectures, interactive case studies, and extensive hands-on internships inside Bhaktivedanta Hospital's active Clinical Research Unit, students gain real-world proficiency across international regulatory guidelines.",
    "duration": "15 Months (Classroom Modules + Live Hospital Internship)",
    "admissionsOpen": "February Every Year",
    "eligibility": "Graduates/Post-graduates in Medicine (MBBS, BDS, BAMS, BHMS), Pharmacy (B.Pharm, M.Pharm), Life Sciences (B.Sc, M.Sc Biotechnology/Microbiology/Biochemistry), and Nursing.",
    "modules": [
      {
        "moduleNo": 1,
        "title": "Introduction to Clinical Research & Drug Development",
        "desc": "Drug discovery pipeline, preclinical pharmacology, and phases of clinical trials (Phase I-IV)."
      },
      {
        "moduleNo": 2,
        "title": "Ethical & Regulatory Frameworks",
        "desc": "ICH-GCP guidelines, Declaration of Helsinki, New Drugs & Clinical Trials Rules 2019, and US FDA / EMA regulations."
      },
      {
        "moduleNo": 3,
        "title": "Institutional Ethics Committee Operations",
        "desc": "Protocol review, informed consent process, compensation for clinical trial injury, and ongoing safety oversight."
      },
      {
        "moduleNo": 4,
        "title": "Clinical Trial Operations & Site Management",
        "desc": "Study startup, investigator site file, source documentation, monitoring visits, and auditor inspection readiness."
      },
      {
        "moduleNo": 5,
        "title": "Clinical Data Management & Biostatistics",
        "desc": "eCRF design, EDC systems, clinical query resolution, database lock, and statistical analysis plans."
      },
      {
        "moduleNo": 6,
        "title": "Pharmacovigilance & Medical Writing",
        "desc": "Adverse event reporting, SAE narratives, CIOMS forms, investigator brochure, and clinical study reports (CSR)."
      }
    ],
    "internshipHighlights": "Guaranteed 6-month hands-on internship in hospital-sponsored and multi-national pharmaceutical clinical trials.",
    "placementSupport": "100% placement support with leading CROs (Quintiles/IQVIA, Parexel, Syneos Health, Cognizant) and hospital research sites."
  },
  "clinicalTrials": {
    "title": "Clinical Trials Centre of Excellence",
    "subtitle": "NABH Accredited GCP-Compliant Research Infrastructure Since 2013",
    "overview": "Bhaktivedanta Hospital & Research Institute has been a distinguished site for global and domestic clinical trials since 2013. We are proud to be the first in Maharashtra and the second hospital in India to achieve NABH Accreditation for Clinical Trials. Our dedicated multidisciplinary research team has successfully executed multiple Phase II, III, and IV trials for international pharmaceutical sponsors and CROs.",
    "stats": {
      "trialsConducted": "45+ Global & Domestic Trials",
      "accreditation": "NABH Accredited Clinical Trial Site",
      "gcpTrainedStaff": "25+ Certified Principal Investigators",
      "regulatoryAudits": "Zero 483 / Warning Letters from Regulatory Audits"
    },
    "therapeuticAreas": [
      "Medical Oncology & Chemotherapy Protocols",
      "Interventional Cardiology & Antiplatelet Therapies",
      "Nephrology & Renal Dialysis Complications",
      "Pediatrics & Neonatal Anti-infective Studies",
      "Endourology & Minimally Invasive Devices",
      "Pulmonology & Respiratory Medicine",
      "General Surgery & Wound Healing Biologics"
    ],
    "infrastructure": [
      {
        "facility": "Dedicated Clinical Research Unit (CRU)",
        "details": "Spacious patient consultation rooms, infusion chairs, and private exam suites."
      },
      {
        "facility": "Calibrated Sample Cold Storage",
        "details": "-80°C and -20°C deep freezers with 24/7 temperature logging and backup power."
      },
      {
        "facility": "Secure Drug Storage & Dispensing Room",
        "details": "Access-controlled investigational product (IP) room with digital temperature & humidity mapping."
      },
      {
        "facility": "CRA Monitoring & Audit Rooms",
        "details": "High-speed internet, dedicated workstations, and scanner facilities for monitor and auditor visits."
      },
      {
        "facility": "Long-term Regulatory Archival Facility",
        "details": "Fire-safe, pest-controlled, access-logged archiving preserving records for 15+ years."
      }
    ]
  },
  "ethicsCommittee": {
    "title": "Institutional Ethics Committees (IEC)",
    "subtitle": "Safeguarding Participant Safety, Dignity & Scientific Integrity",
    "overview": "Bhaktivedanta Hospital & Research Institute maintains two separate, independent, and multidisciplinary Institutional Ethics Committees registered with national statutory authorities to review and monitor biomedical and clinical research protocols.",
    "committees": [
      {
        "id": "iec-ct",
        "name": "Institutional Ethics Committee for Clinical Trials",
        "regAuthority": "Registered with Central Drugs Standard Control Organization (CDSCO) / DCGI",
        "regNumber": "ECR/282/Inst/MH/2013/RR-19",
        "mandate": "Reviews and oversees all Phase II, III, and IV drug and medical device clinical trials under New Drugs and Clinical Trials Rules 2019."
      },
      {
        "id": "iec-bm",
        "name": "Institutional Ethics Committee for Biomedical & Health Research",
        "regAuthority": "Registered with Department of Health Research (DHR), Ministry of Health & Family Welfare",
        "regNumber": "DHR/ICMR/BHR-2020",
        "mandate": "Reviews and oversees investigator-initiated observational studies, DNB academic postgraduate theses, and epidemiological research."
      }
    ],
    "guidingPrinciples": [
      "ICH Harmonised Tripartite Guideline for Good Clinical Practice (ICH-GCP E6 R2)",
      "Declaration of Helsinki (Ethical Principles for Medical Research Involving Human Subjects)",
      "ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants (2017)",
      "New Drugs and Clinical Trials Rules, 2019 (Govt. of India Gazette)"
    ]
  },
  "publications": {
    "title": "Publications & Research Output",
    "subtitle": "Scientific Evidence & High-Impact Clinical Contributions",
    "overview": "Our faculty, consultants, and postgraduate DNB scholars consistently contribute to peer-reviewed international and indexed national medical journals. The hospital promotes ethical, investigator-initiated clinical studies that advance healthcare methodologies and patient outcomes."
  },
  "governmentAccreditation": {
    "title": "Government & National Accreditations",
    "subtitle": "Highest Benchmarks of Regulatory Compliance & Institutional Trust",
    "overview": "Bhaktivedanta Hospital & Research Institute operates under stringent statutory compliances, holding prestigious government registrations and quality accreditations for healthcare delivery, postgraduate medical education, and clinical research.",
    "badges": [
      {
        "title": "NABH Accreditation for Clinical Trials",
        "authority": "National Accreditation Board for Hospitals & Healthcare Providers",
        "detail": "First hospital in Maharashtra and 2nd in all of India to receive prestigious NABH certification for Clinical Trial site and Ethics Committee."
      },
      {
        "title": "DCGI / CDSCO Ethics Committee Registration",
        "authority": "Drugs Controller General of India / Central Drugs Standard Control Organization",
        "detail": "Registered under New Drugs and Clinical Trials Rules (Reg No: ECR/282/Inst/MH/2013/RR-19)."
      },
      {
        "title": "Department of Health Research (DHR) Registration",
        "authority": "Department of Health Research, Ministry of Health & Family Welfare, Govt. of India",
        "detail": "Formal recognition for Biomedical and Health Research Ethics Committee oversight."
      },
      {
        "title": "NBEMS Postgraduate Accreditation",
        "authority": "National Board of Examinations in Medical Sciences (NBEMS)",
        "detail": "Accredited institution conducting DNB and Post-Doctoral residency courses in 7 medical specialties."
      },
      {
        "title": "Maharashtra Medical Council (MMC) & Nursing Council (MNC)",
        "authority": "State Regulatory Councils",
        "detail": "Accredited center for conducting credit-point eligible Continuing Medical Education (CME) and Continuing Nursing Education (CNE)."
      }
    ]
  },
  "customPrograms": []
};

export const defaultDnbInquiries = [];
