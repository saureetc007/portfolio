export interface AcademicScore {
  label: string;
  score: string;
  numberValue: number;
  examination: string;
  streamOrDetails?: string;
}

export interface CommunityEntry {
  id: string;
  name: string;
  affiliation: string;
  subtitle: string;
  description: string;
  tag: string;
}

export interface EducationData {
  school: {
    institution: string;
    location: string;
    status: string;
    scores: AcademicScore[];
  };
  engineering: {
    institution: string;
    programme: string;
    standing: string;
    status: string;
    description: string;
  };
  communities: {
    title: string;
    subtitle: string;
    entries: CommunityEntry[];
  };
}

export const EDUCATION_DATA: EducationData = {
  school: {
    institution: 'Saini International School',
    location: 'Howrah',
    status: 'Completed',
    scores: [
      {
        label: 'CLASS X',
        score: '93.2%',
        numberValue: 93.2,
        examination: 'CBSE Board Examination',
        streamOrDetails: 'Secondary Education',
      },
      {
        label: 'CLASS XII',
        score: '80%',
        numberValue: 80,
        examination: 'CBSE Board Examination',
        streamOrDetails: 'Science Stream (PCM)',
      },
    ],
  },
  engineering: {
    institution: 'Newton School of Technology',
    programme: 'B.Tech in Computer Science and Artificial Intelligence',
    standing: 'First Year',
    status: 'Currently Pursuing',
    description:
      'Foundations of computer science, discrete mathematics, algorithmic problem-solving, and applied artificial intelligence.',
  },
  communities: {
    title: 'Beyond the Classroom',
    subtitle:
      'Learning is not limited to lectures. Communities create opportunities to collaborate, explore and build.',
    entries: [
      {
        id: 'ai-club',
        name: 'AI Club',
        affiliation: 'Newton School of Technology',
        subtitle: 'College community involvement',
        description:
          'Collaborative exploration of artificial intelligence, machine learning concepts, and emerging model architectures.',
        tag: 'MACHINE LEARNING & AI',
      },
      {
        id: 'gdg',
        name: 'Google Developer Groups',
        affiliation: 'College community involvement',
        subtitle: 'Student developer community',
        description:
          'Peer collaboration, technical workshops, and engaging with open developer technologies and practical software practices.',
        tag: 'DEVELOPER COMMUNITY',
      },
    ],
  },
};
