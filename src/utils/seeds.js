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
    { id: 's23', categoryId: 'c2', name: 'Nephrology', icon: 'kidney', shortDescription: 'Advanced kidney disease management, hemodialysis, and renal care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
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

defaultServicesState.services.forEach(ensureStandardServiceTabs);
