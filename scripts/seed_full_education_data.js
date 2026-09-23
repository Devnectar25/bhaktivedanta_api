import dotenv from 'dotenv';
import { supabase } from '../src/utils/supabase.js';
import { dnbProgramData } from '../../bhaktivedanta-design-2/src/data/dnbProgramData.js';

dotenv.config();

async function seedFullData() {
  console.log('Seeding Education & Medical Research database tables in Supabase...');

  // 1. SEED bv_education_research_state (Individual section rows + composite primary row)
  const sectionsToSeed = [
    { id: 'primary', data: dnbProgramData },
    { id: 'dnbProgram', data: { title: dnbProgramData.title, heroIntro: dnbProgramData.heroIntro, quote: dnbProgramData.quote, directorVideo: dnbProgramData.directorVideo } },
    { id: 'seatsMatrix', data: dnbProgramData.seatsMatrix },
    { id: 'specialities', data: dnbProgramData.specialities },
    { id: 'facilities', data: dnbProgramData.facilities },
    { id: 'digitalLibrary', data: dnbProgramData.digitalLibrary },
    { id: 'cmeList2023', data: dnbProgramData.cmeList2023 },
    { id: 'testimonials', data: dnbProgramData.testimonials },
    { id: 'research', data: dnbProgramData.research },
    { id: 'holisticProgram', data: dnbProgramData.holisticProgram },
    { id: 'nursingProgram', data: dnbProgramData.nursingProgram },
    { id: 'cmeProgram', data: dnbProgramData.cmeProgram },
    { id: 'cneProgram', data: dnbProgramData.cneProgram },
    { id: 'spiritualCareCourse', data: dnbProgramData.spiritualCareCourse },
    { id: 'clinicalResearchCourse', data: dnbProgramData.clinicalResearchCourse },
    { id: 'clinicalTrials', data: dnbProgramData.clinicalTrials },
    { id: 'ethicsCommittee', data: dnbProgramData.ethicsCommittee },
    { id: 'publications', data: dnbProgramData.publications },
    { id: 'governmentAccreditation', data: dnbProgramData.governmentAccreditation }
  ];

  for (const s of sectionsToSeed) {
    const { error } = await supabase.from('bv_education_research_state').upsert({
      id: s.id,
      state_data: s.data,
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error(`Error seeding bv_education_research_state [${s.id}]:`, error.message);
    } else {
      console.log(`  ✓ bv_education_research_state -> [${s.id}]`);
    }
  }

  // 2. SEED admin_education_programs (Every individual program & course)
  const allProgramsToSeed = [
    {
      id: 'dnb-program',
      title: 'DNB Program',
      slug: 'dnb-program',
      category: 'DNB Residency',
      badge: 'NBE Accredited',
      duration: '3 Years',
      seats: 16,
      eligibility: 'MBBS Degree with NEET-PG / Central NBE Counselling Allotment',
      overview: 'Bhaktivedanta Hospital & Research Institute conducts post graduate and post-doctoral courses in medical & super specialities. Senior experienced teaching faculty, case presentations, seminars, grand rounds, clinical audits.',
      curriculum: ['General Medicine', 'Paediatrics', 'Ophthalmology', 'Obstetrics & Gynaecology', 'Radio Diagnosis', 'Urology', 'Anesthesiology'],
      faculties: [
        { name: 'Dr. Ajay Sankhe', designation: 'Director & Head of Institute', qualification: 'MD (Pediatrics)' },
        { name: 'Dr. Dhaval Dalal', designation: 'HOD Internal Medicine', qualification: 'MD (Internal Medicine)' }
      ],
      highlights: ['NBE Accredited Institute', 'Level III NICU & Critical Care', 'High Volume Surgeries & Clinical Rotations'],
      contact_info: { phone: '022 2845 8000', email: 'dnb@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'dnb-general-medicine',
      title: 'DNB General Medicine',
      slug: 'dnb-general-medicine',
      category: 'DNB Residency',
      badge: 'NBE Accredited',
      duration: '3 Years',
      seats: 2,
      eligibility: 'MBBS Degree with valid NEET-PG ranking & NBE allotment',
      overview: 'The Department of Internal Medicine treats each patient uniquely by harmonizing mainstream medical protocols along with scientifically testified modalities.',
      curriculum: ['Inpatient Care', 'Critical Care Medicine', 'Infectious Diseases', 'Cardiology & Diabetes Clinics'],
      faculties: [
        { name: 'Dr. Dhaval Dalal', designation: 'HOD of Internal Medicine & Senior Consultant', qualification: 'MD (Internal Medicine)', experience: '32 years+' },
        { name: 'Dr. Suraj Purushotthaman', designation: 'Consultant Physician & Intensivist', qualification: 'DNB (General Medicine)', experience: '12 years+' }
      ],
      highlights: ['Comprehensive 24/7 ICU & High Dependency Unit', 'Interdepartmental Grand Rounds', 'Holistic Patient Management'],
      contact_info: { phone: '022 2845 8000', email: 'dnb@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'dnb-paediatrics',
      title: 'DNB Paediatrics',
      slug: 'dnb-paediatrics',
      category: 'DNB Residency',
      badge: 'NBE Accredited',
      duration: '3 Years',
      seats: 3,
      eligibility: 'MBBS Degree with NEET-PG / Central NBE counseling',
      overview: 'Full-spectrum pediatric and neonatal training with tertiary Level III NICU, pediatric intensive care, high-risk infant follow-up, and pediatric subspecialties.',
      curriculum: ['Neonatal Intensive Care', 'Pediatric Emergency Medicine', 'Pediatric Nephrology & Cardiology', 'Community Child Health'],
      faculties: [
        { name: 'Dr. Ajay Sankhe', designation: 'Director & HOD Pediatrics', qualification: 'MD (Pediatrics)', experience: '30 years+' },
        { name: 'Dr. Girish Patel', designation: 'Senior Consultant Pediatrician & Neonatologist', qualification: 'MD (Pediatrics)', experience: '24 years+' }
      ],
      highlights: ['Advanced Level III NICU with HFOV & Nitric Oxide', 'Surfactant Therapy Program', 'Weekly Mortality & Morbidity Meets'],
      contact_info: { phone: '022 2845 8000', email: 'dnb@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'dnb-ophthalmology',
      title: 'DNB Ophthalmology',
      slug: 'dnb-ophthalmology',
      category: 'DNB Residency',
      badge: 'NBE Accredited',
      duration: '3 Years',
      seats: 4,
      eligibility: 'MBBS Degree with NEET-PG qualification',
      overview: 'High-volume clinical and surgical ophthalmology training including phacoemulsification, small incision cataract surgery (SICS), glaucoma diagnostics, and retina clinics.',
      curriculum: ['Phacoemulsification Cataract Surgery', 'Cornea & Refractive Services', 'Medical Retina & Glaucoma', 'Oculoplasty & Community Eye Camps'],
      faculties: [
        { name: 'Dr. Suraj Prakash Bhagde', designation: 'HOD of Ophthalmology & Senior Eye Surgeon', qualification: 'MS (Ophthalmology)', experience: '22 years+' },
        { name: 'Dr. Sneha Narang', designation: 'Consultant Vitreoretinal Surgeon', qualification: 'MS, DNB, FICO', experience: '11 years+' }
      ],
      highlights: ['Wet-lab microsurgical simulator', 'Community outreach with 10,000+ sight-restoring surgeries', 'Advanced OCT & YAG laser suites'],
      contact_info: { phone: '022 2845 8000', email: 'dnb@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'dnb-obstetrics-gynaecology',
      title: 'DNB Obstetrics & Gynaecology',
      slug: 'dnb-obstetrics-gynaecology',
      category: 'DNB Residency',
      badge: 'NBE Accredited',
      duration: '3 Years',
      seats: 2,
      eligibility: 'MBBS Degree with NEET-PG qualification',
      overview: 'Rigorous residency in maternal-fetal medicine, high-risk obstetrics, painless labor analgesia, 3D gynecological laparoscopy, and reproductive endocrinology.',
      curriculum: ['High-Risk Antenatal Care', 'Labor Ward Management & Emergency C-Sections', 'Minimally Invasive Gynecological Laparoscopy', 'Infertility & Fetal Doppler Rounds'],
      faculties: [
        { name: 'Dr. Veena Sankhe', designation: 'Director & Senior Obstetrician', qualification: 'MD, DGO (Obstetrics & Gynaecology)', experience: '28 years+' },
        { name: 'Dr. Sujata Dalal', designation: 'Senior Consultant Gynecologist', qualification: 'MD, DNB (Ob/Gyn)', experience: '25 years+' }
      ],
      highlights: ['State-of-the-art LDR (Labor-Delivery-Recovery) suites', 'Advanced operative laparoscopy & hysteroscopy', 'Integrated prenatal spiritual care (Garbha Sanskar)'],
      contact_info: { phone: '022 2845 8000', email: 'dnb@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'diploma-radio-diagnosis',
      title: 'Diploma in Radio Diagnosis',
      slug: 'diploma-radio-diagnosis',
      category: 'DNB Diploma',
      badge: 'NBEMS Accredited',
      duration: '2 Years',
      seats: 2,
      eligibility: 'MBBS Degree with NEET-PG qualification',
      overview: 'Comprehensive diagnostic imaging training covering 1.5 Tesla MRI, 128-slice Multidetector CT, 3D/4D ultrasound, color Doppler, digital mammography, and non-vascular interventions.',
      curriculum: ['Computed Tomography (CT)', 'Magnetic Resonance Imaging (MRI)', 'Ultrasound & Color Doppler', 'Interventional Radiology Procedures'],
      faculties: [
        { name: 'Dr. B. K. Singhal', designation: 'HOD of Radiology & Imaging Sciences', qualification: 'MD (Radio Diagnosis)', experience: '26 years+' }
      ],
      highlights: ['Fully filmless hospital PACS network', 'Advanced CT angiography and cardiac imaging', 'Extensive exposure to biopsy and drainage guidance'],
      contact_info: { phone: '022 2845 8000', email: 'dnb@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'dnb-urology',
      title: 'DNB Urology',
      slug: 'dnb-urology',
      category: 'DNB Super Specialty (DrNB)',
      badge: 'NBE Accredited',
      duration: '3 Years',
      seats: 1,
      eligibility: 'MS/DNB General Surgery with valid NEET-SS merit allotment',
      overview: 'Premier surgical residency with cutting-edge holmium laser prostate enucleation (HoLEP), flexible ureterorenoscopy (RIRS), laparoscopic urological oncology, and renal transplantation.',
      curriculum: ['Endourology & Laser Surgery', 'Urological Laparoscopy & Robotic Simulation', 'Renal Transplantation & Vascular Access', 'Urodynamics & Female Urology'],
      faculties: [
        { name: 'Dr. Shirish Yande', designation: 'Director & Senior Consultant Urologist', qualification: 'MS, M.Ch (Urology), DNB', experience: '28 years+' },
        { name: 'Dr. Samit Doshi', designation: 'Consultant Endourologist & Andrologist', qualification: 'DNB (Urology)', experience: '8 years+' }
      ],
      highlights: ['Dedicated Lithotripsy & Laser OT Suites', 'Hands-on operative training under national authorities', 'Active clinical research & urological registry'],
      contact_info: { phone: '022 2845 8000', email: 'dnb@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'dnb-anesthesiology',
      title: 'DNB Anesthesiology',
      slug: 'dnb-anesthesiology',
      category: 'DNB Residency',
      badge: 'NBE Accredited',
      duration: '3 Years',
      seats: 2,
      eligibility: 'MBBS Degree with NEET-PG qualification',
      overview: 'Immersive training across 7 modular super-specialty operation theatres, ultrasound-guided regional anesthesia blocks, neuro-anesthesia, pediatric anesthesia, and acute pain service.',
      curriculum: ['General & Regional Anesthesia', 'Critical Care & Hemodynamic Monitoring', 'Difficult Airway Management', 'Pediatric & Obstetric Anesthesia'],
      faculties: [
        { name: 'Dr. Manisha Dalal', designation: 'HOD of Anesthesiology & Senior Consultant', qualification: 'MD (Anesthesiology)', experience: '27 years+' }
      ],
      highlights: ['Modern workstations with BIS monitoring', 'Ultrasound-guided regional nerve blocks', '24/7 dedicated acute pain management service'],
      contact_info: { phone: '022 2845 8000', email: 'dnb@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'nursing-program',
      title: 'Rosalind S. Teton School of Nursing',
      slug: 'nursing-program',
      category: 'Nursing Education',
      badge: 'Recognized by MNC & INC',
      duration: '3 Years (GNM) / 2 Years (P.B.B.Sc)',
      seats: 50,
      eligibility: '10+2 with min 40% aggregate marks (Science/Arts/Commerce) or Registered ANM/GNM',
      overview: 'Established in 2005 under Shri Chaitanya Health and Care Trust, training compassionate nursing professionals blending modern clinical proficiency with spiritual empathy. Awarded Excellence in Nursing Education by Indus Foundation, USA.',
      curriculum: ['General Nursing & Midwifery (GNM - 30 Seats)', 'Post Basic B.Sc. Nursing (P.B.B.Sc - 20 Seats)', 'Clinical Skills Simulation', 'Community Health Nursing'],
      faculties: [
        { name: 'Principal & Nurse Educator Board', designation: 'Academic Nursing Leadership', qualification: 'M.Sc Nursing' }
      ],
      highlights: ['Hands-on 100+ Bedded Hospital Clinical Rotations', 'Advanced CPR & Obstetrics Simulation Skills Lab', '100% Placement Assistance'],
      contact_info: {
        campus: 'Sheth P. V. Doshi Hospital, Poonam Nagar, Shanti Park, Mira Road (East), Thane - 401107',
        phone: '8291103508 / 022 2811 0000',
        email: 'bhaktinursingschool@yahoo.co.in'
      },
      status: 'Active'
    },
    {
      id: 'cme',
      title: 'Continuing Medical Education (CME)',
      slug: 'cme',
      category: 'Medical Education',
      badge: 'MMC Accredited',
      duration: 'Continuous Programs',
      seats: 150,
      eligibility: 'Registered Medical Practitioners (MBBS, MD, MS, DNB, Specialists)',
      overview: 'High-impact clinical conferences, symposia, and grand rounds accredited by Maharashtra Medical Council (MMC) granting 2-4 credit hours per event. 16+ annual events featuring renowned national faculty.',
      curriculum: ['Advances in Critical Care Medicine & Sepsis', 'National Conclave on COPD', 'High-Risk Obstetrics & Fetal Doppler', 'Kidney Transplant & Immunosuppression Update'],
      faculties: [
        { name: 'Dr. Nikhil Raut', designation: 'Consultant Pulmonologist & CME Coordinator', qualification: 'MD, DNB' }
      ],
      highlights: ['Accredited by Maharashtra Medical Council (MMC)', 'Live Operative Surgical Workshops', 'Free Registration for Academic DNB Residents'],
      contact_info: { phone: '022 2845 8000', email: 'education@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'cne',
      title: 'Continuing Nursing Education (CNE)',
      slug: 'cne',
      category: 'Nursing Education',
      badge: 'MNC Points',
      duration: 'Modular Workshops',
      seats: 100,
      eligibility: 'All Registered Nurses (GNM, B.Sc, M.Sc) holding valid State Nursing Council registration',
      overview: 'Specialized Continuing Nursing Education workshops accredited with credit points by Maharashtra Nursing Council (MNC), empowering nurses with modern critical care, ventilator management, and patient safety protocols.',
      curriculum: ['Critical Care & Ventilator Nursing', 'Infection Prevention & NABH Bundles', 'Emergency Resuscitation (BLS / ACLS)', 'Maternal-Neonatal Kangaroo Care'],
      faculties: [
        { name: 'Nursing Education Committee', designation: 'Clinical Nurse Specialists', qualification: 'M.Sc Nursing, Critical Care Certified' }
      ],
      highlights: ['MNC Credit Points for License Renewal', 'Simulation Manikins for Code Blue Training', 'Comprehensive Patient Safety Training'],
      contact_info: { phone: '022 2845 8000', email: 'nursing.school@yahoo.co.in' },
      status: 'Active'
    },
    {
      id: 'spiritual-care-course',
      title: 'Spiritual Care Certificate Course',
      slug: 'spiritual-care-course',
      category: 'Holistic Healthcare',
      badge: 'Since 2010',
      duration: '6 Months',
      seats: 30,
      eligibility: 'MBBS/MD Doctors, AYUSH Practitioners, Nursing Officers, Medical Social Workers, and Counselors globally',
      overview: 'Introduced in 2010 by the Department of Spiritual Care, this acclaimed certificate course equips healthcare professionals to integrate spiritual well-being into modern medical practice across physical, emotional, intellectual, and spiritual dimensions.',
      curriculum: ['Physical Dimension & Psychosomatic Health', 'Emotional Dimension & Grief Counseling', 'Intellectual Dimension & Clinical Bioethics', 'Spiritual Dimension & Bedside Hope Assessment'],
      faculties: [
        { name: 'Spiritual Care Faculty Council', designation: 'Senior Chaplains & Doctors', qualification: 'Integrative Medicine & Pastoral Care' }
      ],
      highlights: ['14+ Years of Continuous Academic Excellence', 'Practical Bedside Rotations with Palliative Patients', 'International Fellowship Network'],
      contact_info: { phone: '022 2845 8000', email: 'spiritualcare@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'clinical-research-course',
      title: 'Post Graduate Certificate in Clinical Research (PGCR)',
      slug: 'clinical-research-course',
      category: 'Clinical Research',
      badge: '15 Months',
      duration: '15 Months',
      seats: 25,
      eligibility: 'Graduates/Post-graduates in Medicine (MBBS, BDS, BAMS, BHMS), Pharmacy (B.Pharm, M.Pharm), Life Sciences, and Nursing',
      overview: 'Comprehensive 15-month program combining intensive classroom didactic modules with a guaranteed 6-month hands-on hospital clinical trial internship inside our NABH-accredited Clinical Research Unit.',
      curriculum: ['Clinical Research & Drug Development', 'ICH-GCP & New Drugs Rules 2019', 'Institutional Ethics Committee Operations', 'Clinical Data Management & Pharmacovigilance'],
      faculties: [
        { name: 'Dr. Siva Prasad Gourabathini', designation: 'Research Coordinator & Senior Faculty', qualification: 'Ph.D (Life Sciences)' }
      ],
      highlights: ['NABH Accredited Hospital Campus Internship', 'Hands-on eCRF and EDC software training', '100% Placement Support with Leading CROs'],
      contact_info: { phone: '022 2845 8000', email: 'research@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'clinical-trials',
      title: 'Clinical Trials Centre of Excellence',
      slug: 'clinical-trials',
      category: 'Medical Research',
      badge: 'NABH Accredited',
      duration: 'Phase II - IV',
      seats: 0,
      eligibility: 'Multinational & Domestic Sponsored GCP-Compliant Clinical Trials',
      overview: 'Distinguished site for clinical trials since 2013. First hospital in Maharashtra and 2nd in India to achieve NABH Accreditation for Clinical Trials. 45+ completed trials across oncology, cardiology, nephrology, and pediatrics.',
      curriculum: ['Dedicated Clinical Research Unit (CRU)', 'Calibrated -80°C and -20°C Sample Freezers', 'Access-Controlled IP Pharmacy Storage', 'Auditor & CRA Monitoring Rooms'],
      faculties: [
        { name: 'Dr. Ajay Sankhe', designation: 'Director & Principal Investigator', qualification: 'MD (Pediatrics), GCP Certified' },
        { name: 'Dr. Siva Prasad Gourabathini', designation: 'Head of Clinical Research Operations', qualification: 'Ph.D' }
      ],
      highlights: ['NABH Accredited GCP-Compliant Site', '25+ Certified Principal Investigators', 'Zero 483 / Warning Letters from Statutory Audits'],
      contact_info: { phone: '022 2845 8000', email: 'research@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'ethics-committee',
      title: 'Institutional Ethics Committees (IEC)',
      slug: 'ethics-committee',
      category: 'Regulatory & Ethics',
      badge: 'CDSCO & DHR',
      duration: 'Statutory Body',
      seats: 0,
      eligibility: 'All Clinical Trial & Biomedical Research Protocols',
      overview: 'Maintains two independent Institutional Ethics Committees registered with CDSCO (ECR/282/Inst/MH/2013/RR-19) and DHR (DHR/ICMR/BHR-2020) to ensure participant safety, rights, and scientific rigor.',
      curriculum: ['IEC for Clinical Trials (CDSCO Regulated)', 'IEC for Biomedical & Health Research (DHR Recognized)', 'Scientific Review Committee Protocol Review', 'Periodic Serious Adverse Event (SAE) Oversight'],
      faculties: [
        { name: 'Dr. Raakhi K Tripathi', designation: 'Chairperson IEC', qualification: 'MBBS, MD (Pharmacology)' },
        { name: 'Dr. Suraj Prakash Bhagde', designation: 'Member Secretary IEC', qualification: 'MBBS, MS (Ophthalmology)' }
      ],
      highlights: ['Registered with DCGI / CDSCO & DHR', 'Standard Operating Procedures (SOPs) compliant with NDCT Rules 2019', 'Independent multi-disciplinary board with legal and lay representatives'],
      contact_info: { phone: '022 2845 8000', email: 'iec@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'publications',
      title: 'Publications & Research Output',
      slug: 'publications',
      category: 'Medical Research',
      badge: 'Indexed Theses',
      duration: 'Annual Compendium',
      seats: 0,
      eligibility: 'Postgraduate Scholars, Clinical Consultants, and Academic Faculty',
      overview: 'Repository of peer-reviewed scientific publications in international and indexed national journals, epidemiologic studies, and postgraduate DNB dissertations advancing evidence-based patient care.',
      curriculum: ['Thoracic Oncology & Lung Cancer Studies (JTO)', 'Neonatal Intensive Care Outcomes (Indian J Pediatr)', 'HoLEP Laser Prostatectomy Advances (Urol Int)', 'Community High-Volume SICS Visual Outcomes (JCOR)'],
      faculties: [
        { name: 'Academic Research Review Board', designation: 'Senior Faculty & Biostatisticians', qualification: 'MD, Ph.D' }
      ],
      highlights: ['Regular peer-reviewed journal contributions', 'Epidemiological clinical outcome audits', 'Dedicated biostatistical support for DNB dissertations'],
      contact_info: { phone: '022 2845 8000', email: 'research@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'government-accreditation',
      title: 'Government & National Accreditations',
      slug: 'government-accreditation',
      category: 'Accreditation',
      badge: 'Govt Approved',
      duration: 'Permanent Accreditations',
      seats: 0,
      eligibility: 'Statutory Compliances & Healthcare Quality Standards',
      overview: 'Holds prestigious government registrations and quality accreditations for healthcare delivery, postgraduate medical education, and clinical trials under statutory national regulatory bodies.',
      curriculum: ['NABH Accreditation for Clinical Trials (Quality Council of India)', 'DCGI / CDSCO Ethics Committee Registration (ECR/282/Inst/MH/2013/RR-19)', 'Department of Health Research (DHR) Registration', 'National Board of Examinations in Medical Sciences (NBEMS)', 'Maharashtra Medical Council (MMC) & Maharashtra Nursing Council (MNC)'],
      faculties: [
        { name: 'Quality & Regulatory Affairs Cell', designation: 'Accreditation Directorate', qualification: 'Hospital Quality Management' }
      ],
      highlights: ['State’s 1st NABH Accredited Clinical Trial Center', 'NBEMS Accredited in 7 Specialties', 'Continuous statutory inspections & audit readiness'],
      contact_info: { phone: '022 2845 8000', email: 'quality@bhaktivedantahospital.com' },
      status: 'Active'
    },
    {
      id: 'edu-prog-1789992131641',
      title: 'abcd',
      slug: 'abcd',
      category: 'Allied Health Science',
      badge: 'Accredited',
      duration: '1 Year',
      seats: 2,
      eligibility: 'cghjknmbvghjkm,nvghjknm',
      overview: 'hvgfgyhjnbvgfhjnbvgfh',
      curriculum: ['Module 1', 'Module 2'],
      faculties: [],
      highlights: ['Accredited Program', 'Clinical Training'],
      contact_info: { email: 'education@bhaktivedantahospital.com', phone: '022 2845 8000' },
      status: 'Active'
    }
  ];

  for (const prog of allProgramsToSeed) {
    const { error } = await supabase.from('admin_education_programs').upsert({
      id: prog.id,
      title: prog.title,
      slug: prog.slug,
      category: prog.category,
      badge: prog.badge,
      duration: prog.duration,
      seats: prog.seats,
      eligibility: prog.eligibility,
      overview: prog.overview,
      curriculum: prog.curriculum,
      faculties: prog.faculties,
      highlights: prog.highlights,
      contact_info: prog.contact_info,
      status: prog.status,
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error(`Error seeding admin_education_programs [${prog.title}]:`, error.message);
    } else {
      console.log(`  ✓ admin_education_programs -> [${prog.title}] (${prog.slug})`);
    }
  }

  // 3. Final verification of both tables
  const { data: finalStateRows } = await supabase.from('bv_education_research_state').select('id');
  const { data: finalProgRows } = await supabase.from('admin_education_programs').select('id, title, slug');

  console.log('\n=============================================');
  console.log('SEEDING COMPLETED SUCCESSFULLY IN SUPABASE!');
  console.log(`Total rows in bv_education_research_state: ${finalStateRows?.length}`);
  console.log(`Total rows in admin_education_programs:    ${finalProgRows?.length}`);
  console.log('=============================================\n');
}

seedFullData().catch(console.error);
