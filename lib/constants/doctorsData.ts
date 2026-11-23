export interface Provider {
  id: number;
  slug: string;
  name: string;
  fullName?: string;
  credentials: string;
  title: string;
  speciality: string;
  trustBadges?: string[];
  fullDescription: string;
  clinicalFocus?: string[];
  education?: string[];
  certifications?: string[];
  affiliations?: string[];
  leadershipAndAwards?: string[];
  publications?: string[];
  personalLife?: string;
  languages?: string[];
  fax?: string;
  image: string;
}

const getLastName = (name: string) => {
  const clean = name.replace(/,\s*(MD|DO|M\.D\.|D\.O\.)/gi, "").trim();
  return clean.split(/\s+/).pop() ?? clean;
};

export const providers: Provider[] = [
  {
    id: 1,
    slug: "paresh-chandra-giri",
    name: "Dr. Paresh Chandra Giri",
    fullName: "Dr. Paresh Chandra Giri, MD",
    credentials: "MD",
    title: "Board-Certified Pulmonologist & Critical Care Medicine Specialist | Director of Pulmonary Hypertension Care",
    speciality: "Pulmonary & Critical Care Medicine",
    trustBadges: [
      "ABIM Board Certified",
      "Director of Pulmonary Hypertension Care",
      "Fax: (909) 453-3676",
    ],
    fullDescription:
      "Dr. Paresh Chandra Giri is a board-certified Pulmonary and Critical Care physician bringing world-class academic expertise to the Inland Empire Lung & Sleep Institute in Redlands, California. He possesses a highly specialized clinical focus on the treatment and management of pulmonary hypertension and unexplained dyspnea.\n\nHis extensive medical training began at the Tribhuvan University Institute of Medicine. He subsequently completed a rigorous Internal Medicine residency at USC / Los Angeles General Medical Center, followed by a highly specialized fellowship in Pulmonary Disease and Critical Care Medicine at Loma Linda University.\n\nDr. Giri is a driving force in both clinical research and the education of future physicians. He holds dual academic appointments as an Associate Clinical Professor of Medicine (School of Medicine) and an Associate Clinical Professor of Cardiopulmonary Sciences (School of Allied Health Professions) at Loma Linda University. During his tenure at Loma Linda University Medical Center, Dr. Giri established a nationally recognized pulmonary hypertension program to improve patient access to specialized respiratory care across the Inland Empire.\n\nToday, he continues to advance respiratory science as the Principal Investigator on multiple pulmonary hypertension clinical studies. His research is widely published in peer-reviewed medical literature, and he serves on the national committee responsible for reviewing and accrediting Pulmonary Hypertension Centers of Excellence across the United States.",
    clinicalFocus: [
      "Pulmonary Hypertension",
      "Unexplained Dyspnea",
    ],
    education: [
      "Fellowship: Loma Linda University (Pulmonary Disease & Critical Care Medicine)",
      "Residency: USC / Los Angeles General Medical Center (Internal Medicine)",
      "Medical School: Tribhuvan University Institute of Medicine",
    ],
    certifications: [
      "Board Certified: Pulmonary Disease (American Board of Internal Medicine)",
      "Board Certified: Critical Care Medicine (American Board of Internal Medicine)",
      "CA State Medical License: Active (through 2026)",
    ],
    affiliations: [
      "Loma Linda University Medical Center",
      "Associate Clinical Professor, Medicine (LLU School of Medicine)",
      "Associate Clinical Professor, Cardiopulmonary Sciences (LLU School of Allied Health Professions)",
    ],
    publications: [
      "Giri PC, Merrill-Henry J, Rajah T, Sullivan DR, Oyoyo U, Barry K, Elwing JM, Balasubramanian VP. Shared Decision-Making During Pulmonary Arterial Hypertension Therapy Selection: A Patient and Clinician Survey. Pulm Circ. 2026 Jul 14;16(3):e70364. doi: 10.1002/pul2.70364. PMID: 42516672.",
      "Zavorsky GS, Elkinany S, Alismail A, Thapamagar SB, Terry MH, Anholm JD, Giri PC. Examining discordance in spirometry reference equations: A retrospective study. Physiol Rep. 2025 Mar;13(5):e70212. doi: 10.14814/phy2.70212. PMID: 40012207.",
      "Chen H, Joshi S, Oberle AJ, Wong AK, Shaz D, Thapamagar S, Tan L, Anholm JD, Giri PC, Henriquez C, Huang YT. Development and Evaluation of a Small Airway Disease Index Derived From Modeling the Late-Expiratory Flattening of the Flow-Volume Loop. Front Physiol. 2022 Jun 6;13:914972. doi: 10.3389/fphys.2022.914972. PMID: 35733991.",
      "Giri PC, Chowdhury AM, Bedoya A, Chen H, Lee HS, Lee P, Henriquez C, MacIntyre NR, Huang YT. Application of Machine Learning in Pulmonary Function Assessment Where Are We Now and Where Are We Going? Front Physiol. 2021 Jun 24;12:678540. doi: 10.3389/fphys.2021.678540. PMID: 34248665.",
      "Giri PC, Stevens GJ, Merrill-Henry J, Oyoyo U, Balasubramanian VP. Participation in pulmonary hypertension support group improves patient-reported health quality outcomes: a patient and caregiver survey. Pulm Circ. 2021 May 17;11(2):20458940211013258. doi: 10.1177/20458940211013258. PMID: 34035896.",
      "Saggar R, Giri PC, Deng C, Johnson D, McCloy MK, Liang L, Shaikh F, Hong J, Channick RN, Shapiro SS, Lynch JP, Belperio JA, Weigt SS, Ramsey AL, Ross DJ, Sayah DM, Shino MY, Derhovanessian A, Sherman AE, Saggar R. Significance of autoimmune disease in severe pulmonary hypertension complicating extensive pulmonary fibrosis: a prospective cohort study. Pulm Circ. 2021 May 2;11(2):20458940211011329. doi: 10.1177/20458940211011329. PMID: 34017506.",
    ],
    fax: "(909) 453-3676",
    image: "/doctors_images/dr_paresh_giri.webp",
  },
  {
    id: 2,
    slug: "roger-seheult",
    name: "Dr. Roger D. Seheult",
    fullName: "Dr. Roger D. Seheult, MD",
    credentials: "MD",
    title: "Sleep Medicine & Medical Education Specialist",
    speciality: "Sleep Medicine & Medical Education Specialist",
    trustBadges: [
      "Triple ABIM Board Certified",
      "MedCram Co-Founder",
      "Fax: (909) 453-3676",
    ],
    fullDescription:
      "Dr. Roger D. Seheult is a triple board-certified physician specializing in Sleep Apnea and Sleep Disorders, as well as Lifestyle Medicine. He brings an extraordinary blend of clinical excellence and global medical education to the Inland Empire Lung & Sleep Institute in Redlands, California.\n\nDr. Seheult earned his Bachelor of Science in Chemistry from the University of California, Riverside, and his Doctor of Medicine from Loma Linda University. He completed his Internal Medicine residency at Riverside County Regional Medical Center, then returned to Loma Linda University Health for his fellowship in Pulmonary Disease.\n\nA passionate educator, Dr. Seheult holds dual academic appointments as an Associate Clinical Professor at the University of California, Riverside School of Medicine, and an Assistant Clinical Professor at Loma Linda University's School of Medicine and Allied Health. He also serves as the Medical Director for the Crafton Hills College Respiratory Care Program and is the director of a local sleep laboratory.\n\nBeyond his clinical practice, Dr. Seheult is a globally recognized medical educator. In 2012, he co-founded MedCram, a premier medical education company that provides CME-accredited training videos utilized by hospitals and medical professionals worldwide, boasting an audience of over 1 million subscribers. For his outstanding contributions to medicine and public health policy, he has been honored with the William L. Cover MD Award by the San Bernardino County Medical Society, the Sages of Clinical Service Award by United Health Group, and a Medical Merit Medal from the Kingdom of Bahrain. Alongside his educational outreach, Dr. Seheult is an active clinical researcher, publishing studies on COVID-19 therapies, venous thromboembolism, and high-altitude pulmonary physiology.",
    clinicalFocus: [
      "Sleep Apnea and Sleep Disorders",
      "Lifestyle Medicine",
    ],
    education: [
      "Fellowship: Loma Linda University Health (Pulmonary Disease)",
      "Residency: Riverside County Regional Medical Center (Internal Medicine)",
      "Medical School: Loma Linda University (Doctor of Medicine)",
      "Undergraduate: University of California, Riverside (B.S. in Chemistry)",
    ],
    certifications: [
      "Board Certified: Sleep Medicine (ABIM)",
      "Board Certified: Pulmonary Disease (ABIM)",
      "Board Certified: Internal Medicine (ABIM)",
    ],
    affiliations: [
      "Co-Founder & Instructor, MedCram L.L.C.",
      "Associate Clinical Professor, UC Riverside School of Medicine",
      "Assistant Clinical Professor, Loma Linda University",
      "Medical Director, Crafton Hills College Respiratory Care Program",
      "Clinical Practice: Optum California (Beaumont, CA)",
    ],
    publications: [
      "Berger JS, Seheult R, Laliberté F, Crivera C, Lejeune D, Xiao Y, Schein J, Lefebvre P, Kaatz S. Clinical outcomes of prolonged anticoagulation with rivaroxaban after unprovoked venous thromboembolism. Res Pract Thromb Haemost. 2017 Nov 15;2(1):58-68. doi: 10.1002/rth2.12050. PMID: 30046707.",
      "Malone DC, Seheult R, Brixner D, Oderda G, Burnett BP, Biskupiak J. The cost-effectiveness of using vilobelimab with immunomodulators to treat severely ill mechanically ventilated patients with COVID-19: A subgroup analysis of the PANAMO study. Am J Health Syst Pharm. 2026 Jan 27;83(3):e126-e133. doi: 10.1093/ajhp/zxaf174. PMID: 40638782.",
      "Malone DC, Biskupiak J, Brixner D, Oderda G, Seheult R. An evaluation of vilobelimab (anti-C5a) as a cost-effective option to treat severely ill mechanically ventilated patients with COVID-19. Am J Health Syst Pharm. 2025 Apr 29;82(9):e438-e446. doi: 10.1093/ajhp/zxae318. PMID: 39475087.",
      "Seheult RD, Ruh K, Foster GP, Anholm JD. Prophylactic bosentan does not improve exercise capacity or lower pulmonary artery systolic pressure at high altitude. Respir Physiol Neurobiol. 2009 Feb 28;165(2-3):123-30. doi: 10.1016/j.resp.2008.10.005. PMID: 18977464.",
      "Khorana AA, Berger JS, Wells PS, Seheult R, Ashton V, Laliberté F, Crivera C, Lejeune D, Schein J, Wildgoose P, Lefebvre P, Kaatz S. Risk for Venous Thromboembolism Recurrence Among Rivaroxaban-treated Patients Who Continued Versus Discontinued Therapy: Analyses Among Patients with VTE. Clin Ther. 2017 Jul;39(7):1396-1408. doi: 10.1016/j.clinthera.2017.05.357. PMID: 28645879.",
    ],
    fax: "(909) 453-3676",
    image: "/doctors_images/dr_roger_sehenult.webp",
  },
  {
    id: 3,
    slug: "luke-buxton",
    name: "Dr. Luke Buxton",
    fullName: "Dr. Luke Buxton, DO",
    credentials: "DO",
    title: "Pulmonary, Critical Care & Sleep Medicine Specialist",
    speciality: "Pulmonary, Critical Care & Sleep Medicine Specialist",
    trustBadges: [
      "Quadruple ABIM Board Certified",
      "ACP Resident of the Year",
    ],
    fullDescription:
      "Dr. Luke Buxton, DO, is a highly accomplished physician specializing in Pulmonary Disease, Critical Care, and Sleep Medicine at the Inland Empire Lung & Sleep Institute in Redlands, California.\n\nDr. Buxton earned his Bachelor of Science in Health Sciences from UC Santa Cruz before completing his Doctor of Osteopathic Medicine at the Chicago College of Osteopathic Medicine at Midwestern University. He possesses a distinguished track record of clinical leadership, having been named Chief Resident during his Internal Medicine residency at Franciscan Health Olympia Fields, where he was also honored as the ACP Resident of the Year. Following residency, he worked as a full-time nocturnist for the Franciscan Physician Network, managing high-volume hospital admissions and open ICU coverage.\n\nHe subsequently completed a rigorous fellowship in Pulmonary Disease and Critical Care Medicine at Arrowhead Regional Medical Center, where his peers recognized his leadership by naming him Chief Fellow. Further dedicating his career to comprehensive respiratory health, Dr. Buxton completed a highly specialized Sleep Medicine fellowship at Loma Linda University Medical Center.\n\nA dedicated clinical researcher, Dr. Buxton has authored several peer-reviewed publications covering critical care outcomes and rare pulmonary case reports. Today, he focuses his practice on comprehensive pulmonary, critical care, and sleep medicine.",
    clinicalFocus: [
      "Sleep Medicine",
      "Critical Care Medicine",
    ],
    education: [
      "Fellowship (Sleep Medicine): Loma Linda University Medical Center (2024–2025)",
      "Fellowship (Pulmonary & Critical Care): Arrowhead Regional Medical Center (2021–2024)",
      "Residency (Internal Medicine): Franciscan Health Olympia Fields (2017–2020)",
      "Medical School: Chicago College of Osteopathic Medicine at Midwestern University (Class of 2017)",
      "Undergraduate: University of California, Santa Cruz (B.S. Health Sciences)",
    ],
    certifications: [
      "Board Certified: Sleep Medicine (ABIM)",
      "Board Certified: Pulmonary Disease (ABIM)",
      "Board Certified: Critical Care Medicine (ABIM)",
      "Board Certified: Internal Medicine (ABIM)",
    ],
    leadershipAndAwards: [
      "Chief Fellow, Arrowhead Regional Medical Center",
      "Chief Resident, Franciscan Health Olympia Fields",
      "ACP Resident of the Year",
    ],
    affiliations: [
      "Hospital Affiliation: Redlands Community Hospital",
    ],
    publications: [
      "Buxton L, Hasan M. A Case of Chronic Aspiration Bronchiolitis. Cureus. 2022 Feb 24;14(2):e22562. doi: 10.7759/cureus.22562. PMID: 35371767.",
      "Phan AT, Buxton L, Choudhery MW, Ghantarchyan H, Converse C. A Rare Case of an Eosinophilic Pleural Effusion and Loculated Ascites Associated with Strongyloides stercoralis Hyperinfection Syndrome in California. Case Rep Pulmonol. 2024 Apr 8;2024:6652207. doi: 10.1155/2024/6652207. PMID: 38628651.",
      "Phan AT, Ucar AA, Malkoc A, Hu J, Buxton L, Tseng AW, Dong F, Nguyễn JPT, Modi AP, Deshpande O, Lay J, Ku A, Ogunyemi D, Arabian S. ABO blood group and rhesus factor association with inpatient COVID-19 mortality and severity: a two-year retrospective review. Blood Res. 2023 Sep 30;58(3):138-144. doi: 10.5045/br.2023.2023122. PMID: 37751922.",
      "Bhagat A, Buxton L, Hasan M. Correlation Between HbA1c Levels and Mortality Rates in Hospitalized COVID-19 Patients. Cureus. 2022 Nov 10;14(11):e31347. doi: 10.7759/cureus.31347. PMID: 36514608.",
    ],
    image: "/doctors_images/dr.webp",
  },
  {
    id: 4,
    slug: "tarik-ali-ngab",
    name: "Dr. Tarik Ali Ngab",
    fullName: "Dr. Tarik Ali Ngab, M.D.",
    credentials: "MD",
    title: "Pulmonary & Critical Care Specialist (Advanced Bronchoscopy) | Medical Director, Intensive Care Services",
    speciality: "Pulmonary & Critical Care Specialist (Advanced Bronchoscopy)",
    trustBadges: [
      "Triple ABIM Board Certified",
      "ICU Medical Director",
    ],
    fullDescription:
      "Dr. Tarik Ali Ngab, M.D, is a triple board-certified Pulmonary and Critical Care physician at the Inland Empire Lung & Sleep Institute in Redlands, California. With over a decade of specialized clinical experience, he provides comprehensive care for patients facing complex respiratory conditions and critical illnesses.\n\nDr. Ngab earned his medical degree from the University of Tripoli School of Medicine. He subsequently completed his Internal Medicine residency at Olive View/UCLA Medical Center, followed by a rigorous fellowship in Pulmonary Disease and Critical Care Medicine at Cedars-Sinai Medical Center.\n\nA dedicated clinical leader, Dr. Ngab serves as the Medical Director of Intensive Care Services, ICU Director, and Cardiopulmonary Director at Redlands Community Hospital. He maintains an active practice with Optum and is a recognized member of the American College of Chest Physicians (ACCP). Deeply committed to medical education, he serves as an Assistant Clinical Professor at UC Riverside, helping to train future physicians.\n\nDr. Ngab possesses highly specialized expertise in advanced lung procedures—including robotic bronchoscopy—as well as pulmonary physiology and comprehensive cardiopulmonary testing. Alongside his clinical practice, he is an active medical researcher whose work on critical care outcomes, epidemiology, and medical training has been published in peer-reviewed medical literature.",
    clinicalFocus: [
      "Asthma & COPD Management",
      "Interstitial Lung Disease (ILD)",
      "Respiratory Failure & Sepsis Morbidity",
      "Advanced Pulmonary Procedures & Robotic Bronchoscopy",
      "Cardiopulmonary & Lung Function Testing",
      "Therapeutic Hypothermia & CT Scan Interpretation",
    ],
    education: [
      "Fellowship: Cedars-Sinai Medical Center (Pulmonary Disease & Critical Care Medicine)",
      "Residency: Olive View/UCLA Medical Center (Internal Medicine)",
      "Medical School: University of Tripoli School of Medicine",
    ],
    certifications: [
      "Board Certified: Pulmonary Disease (ABIM)",
      "Board Certified: Critical Care Medicine (ABIM)",
      "Board Certified: Internal Medicine (ABIM)",
      "Additional Licenses: Fluoroscopy, DEA",
    ],
    affiliations: [
      "Redlands Community Hospital (ICU Director, Cardiopulmonary Director)",
      "Optum",
      "UC Riverside (Assistant Clinical Professor)",
      "Saint Bernardine Medical Center",
      "San Gorgonio Memorial Hospital",
      "Temecula Valley Hospital",
    ],
    publications: [
      "Al-Ghoula F, Kantas DK, Rovati L, Sagar AE, Megri M, Zarmouh A, Gmehlin CG, Benlamin MG, Ngab T, Gajic O. Leveraging social media for resident training in developing countries: A case study of Libya. Biomol Biomed. 2025 Apr 26;25(6):1418-1424. doi: 10.17305/bb.2024.10806. PMID: 39001617.",
      "Traina MI, Sanchez DR, Hernandez S, Bradfield JS, Labedi MR, Ngab TA, Steurer F, Montgomery SP, Meymandi SK. Prevalence and Impact of Chagas Disease Among Latin American Immigrants With Nonischemic Cardiomyopathy in Los Angeles, California. Circ Heart Fail. 2015 Sep;8(5):938-43. doi: 10.1161/CIRCHEARTFAILURE.115.002229. PMID: 26206855.",
      "Lam J, Nikhanj N, Ngab T, Tennant R, Shahedi K, Mathisen G, Donovan S, Kamangar N. Severe cases of pandemic H1N1 pneumonia and respiratory failure requiring intensive care. J Intensive Care Med. 2011 Sep-Oct;26(5):318-25. doi: 10.1177/0885066610392684. PMID: 25966494.",
    ],
    image: "/doctors_images/dr_tarik.webp",
  },
  {
    id: 5,
    slug: "sahib-daljit-singh-grewal",
    name: "Dr. Sahib Daljit Singh",
    fullName: "Dr. Sahib Daljit Singh Grewal, MD",
    credentials: "MD",
    title: "Pulmonary & Critical Care Specialist (Advanced Bronchoscopy & Interventional Pulmonology)",
    speciality: "Pulmonary & Critical Care Specialist (Advanced Bronchoscopy & Interventional Pulmonology)",
    trustBadges: [
      "Interventional Pulmonology",
      "Advanced Bronchoscopy Specialist",
    ],
    fullDescription:
      "Dr. Sahib Daljit Singh Grewal, MD, is a Pulmonary and Critical Care physician at the Inland Empire Lung & Sleep Institute in Redlands, California. He is dedicated to helping patients navigate complex lung diseases and serious medical conditions with cutting-edge interventions.\n\nDr. Grewal earned his medical degree from the Keck School of Medicine of the University of Southern California. He completed both his Internal Medicine residency and his highly specialized Pulmonary and Critical Care fellowship at Loma Linda University Health.\n\nIn his clinical practice, Dr. Grewal focuses on managing severe respiratory conditions, including pulmonary hypertension, interstitial lung disease, and sepsis. He possesses highly specialized expertise in interventional pulmonology and advanced bronchoscopy, including endobronchial ultrasound (EBUS). Furthermore, he is experienced in the use of advanced hemodynamic devices to care for critically ill patients in the intensive care unit.\n\nDr. Grewal is affiliated with Redlands Community Hospital and St. Bernardine Medical Center. Alongside his clinical work, he has contributed to medical research, including comparative studies on respiratory viruses published in peer-reviewed literature.",
    clinicalFocus: [
      "Advanced Bronchoscopy",
      "Critical Care Medicine",
    ],
    education: [
      "Fellowship: Loma Linda University Health (Pulmonary & Critical Care, Class of 2025)",
      "Residency: Loma Linda University Health (Internal Medicine)",
      "Medical School: Keck School of Medicine of the University of Southern California",
    ],
    certifications: [
      "Specialties: Pulmonary Disease, Critical Care Medicine, Internal Medicine",
    ],
    affiliations: [
      "Redlands Community Hospital",
      "St. Bernardine Medical Center",
    ],
    publications: [
      "Jeganathan N, Grewal S, Sathananthan M. Comparison of Deaths from COVID-19 and Seasonal Influenza in the USA. Lung. 2021 Oct;199(5):559-561. doi: 10.1007/s00408-021-00468-0. PMID: 34414503.",
    ],
    image: "/doctors_images/dr_sahib_grewal.webp",
  },
  {
    id: 6,
    slug: "enrique-g-gil",
    name: "Dr. Enrique G. Gil",
    fullName: "Dr. Enrique G. Gil, MD",
    credentials: "MD",
    title: "Pulmonologist; Subspecialties in Critical Care, Advanced Lung Disorders & Sleep Medicine",
    speciality: "Pulmonary, Critical Care & Sleep Medicine Specialist",
    trustBadges: [
      "Triple ABIM Board Certified",
      "Bilingual: English & Spanish",
    ],
    fullDescription:
      "Dr. Enrique G. Gil, MD, is a highly experienced, triple board-certified physician specializing in Pulmonary Disease, Internal Medicine, and Sleep Medicine at the Inland Empire Lung & Sleep Institute in Redlands, California. Fluent in both English and Spanish, Dr. Gil has spent decades delivering comprehensive, expert respiratory care to the local community.\n\nDr. Gil earned his medical degree from the Universidad Autónoma de Guadalajara, where he graduated first in his class of 400 medical students. He pursued extensive postgraduate training at several leading institutions, beginning with a Family Medicine residency at Riverside University Health System / UC Riverside, followed by an Internal Medicine residency at Loma Linda University Medical Center (LLUMC). During his tenure at LLUMC, his dedication to clinical excellence earned him the title of Top Resident of the Year twice, and he was selected to serve as Chief Medical Resident in Internal Medicine.\n\nHe then completed a highly competitive Pulmonary Disease and Critical Care Medicine fellowship at the UCLA David Geffen School of Medicine / UCLA Medical Center. Demonstrating his profound medical expertise, Dr. Gil scored in the top 2 to 3 percent nationwide on his initial pulmonary and critical care board examinations. Furthermore, he trained specifically in Sleep Medicine under Dr. Phil Westbrook, a founding member of the American Academy of Sleep Medicine.\n\nA respected clinical leader in the region, Dr. Gil has previously served as the Chairman of the Department of Pulmonary, Critical Care & Sleep Medicine at Beaver Medical Group. His profound impact on Redlands Community Hospital includes years of service as the Medical Director of the Intensive Care Unit, as well as a tenure as the hospital's Chief of Staff.\n\nDr. Gil’s clinical excellence has been formally recognized with the Castle Connolly Top Doctors award for the LA Area, and his professional insights were recently featured in the medical press article, 'Elevating Patient Care in Respiratory Health.'",
    clinicalFocus: [
      "Sleep Medicine",
      "Advanced Lung Disorders",
    ],
    education: [
      "Fellowship: UCLA David Geffen School of Medicine / UCLA Medical Center (Pulmonary Disease & Critical Care Medicine)",
      "Sleep Medicine Training: Trained under AASM founding member Dr. Phil Westbrook",
      "Residency (Internal Medicine): Loma Linda University Health Education Consortium",
      "Residency (Family Medicine): Riverside University Health System / UC Riverside",
      "Medical School: Universidad Autónoma de Guadalajara (Graduated 1st in class of 400)",
    ],
    certifications: [
      "Board Certified: Pulmonary Disease (ABIM)",
      "Board Certified: Sleep Medicine (ABIM)",
      "Board Certified: Internal Medicine (ABIM)",
    ],
    leadershipAndAwards: [
      "Former Chief of Staff, Redlands Community Hospital",
      "Former ICU Medical Director, Redlands Community Hospital",
      "Chairman, Dept. of Pulmonary, Critical Care & Sleep Medicine, Beaver Medical Group",
      "Award: Top Doctors: LA Area (Castle Connolly, 2013)",
    ],
    languages: ["English", "Spanish"],
    publications: [
      "Tashkin DP, Kleerup EC, Hoh CK, Kim KJ, Webber MM, Gil E. Effects of ‘Crack’ Cocaine on Pulmonary Alveolar Permeability. Chest. 1997.",
      "Press Feature: \"Enrique G. Gil, MD: Elevating Patient Care in Respiratory Health\" (Aug 2024).",
    ],
    image: "/doctors_images/dr_enrique_gil.webp",
  },
  {
    id: 7,
    slug: "aalok-devendra-shah",
    name: "Dr. Aalok Devendra Shah",
    fullName: "Dr. Aalok Devendra Shah, MD",
    credentials: "MD",
    title: "Pulmonologist and Critical Care Physician",
    speciality: "Pulmonary & Critical Care Medicine",
    trustBadges: [
      "Triple ABIM Board Certified",
      "U.S. Air Force Veteran",
    ],
    fullDescription:
      "Dr. Aalok Devendra Shah, MD, is a triple board-certified pulmonologist and critical care physician with over 20 years of medical experience. A proud U.S. Air Force veteran, Dr. Shah brings a profound dedication to service and specialized respiratory expertise to the Inland Empire Lung & Sleep Institute in Redlands, California. Fluent in both English and Spanish, he provides expert, accessible care to a diverse patient population.\n\nDr. Shah studied medicine at the Northwestern University Feinberg School of Medicine. He subsequently completed his Internal Medicine residency at Lackland Air Force Base in Texas, followed by a rigorous Pulmonary and Critical Care Fellowship at the Naval Medical Center in San Diego. Dr. Shah ultimately concluded his distinguished military medical career at the Travis AFB David Grant Medical Center.\n\nSince 2013, Dr. Shah and his family have been deeply committed to serving the Inland Empire community. He has provided specialized pulmonary and intensive care through Beaver Medical Group, Optum, and IE Lung, maintaining active hospital affiliations at Redlands Community Hospital and San Gorgonio Memorial Hospital.",
    personalLife:
      "Beyond his clinical practice, Dr. Shah is a devoted husband, father, and grandfather. He maintains a special clinical and personal interest in exercise, staying active with sports—especially those involving a frisbee or racquet. His diverse personal interests also include reading, mythology, religion, and listening to punk rock and ska music.",
    clinicalFocus: [
      "Interstitial Lung Disease",
      "Asthma",
    ],
    education: [
      "Fellowship: Naval Medical Center, San Diego (Pulmonary & Critical Care Medicine)",
      "Residency: Lackland AFB, Texas (Internal Medicine)",
      "Medical School: Northwestern University Feinberg School of Medicine",
      "Military Service: U.S. Air Force Veteran (Travis AFB David Grant Medical Center)",
    ],
    certifications: [
      "Board Certified: Pulmonary Disease (ABIM)",
      "Board Certified: Critical Care Medicine (ABIM)",
      "Board Certified: Internal Medicine (ABIM)",
    ],
    affiliations: [
      "Redlands Community Hospital",
      "San Gorgonio Memorial Hospital",
      "Years of Experience: 20+ Years",
      "Decade+ of Inland Empire service (Beaver Medical Group & Optum)",
    ],
    languages: ["English", "Spanish"],
    image: "/dr_alok.webp",
  },
].sort((first, second) =>
  getLastName(first.name).localeCompare(getLastName(second.name)),
);

export function getDoctorBySlug(slug: string): Provider | undefined {
  return providers.find((p) => p.slug === slug);
}

export function getAllDoctorSlugs(): string[] {
  return providers.map((p) => p.slug);
}
