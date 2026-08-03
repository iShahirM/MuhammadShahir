export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  grade: string;
  bullets: string[];
  award: string;
  extracurricular: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'ai' | 'marketing' | 'design' | 'climate';
  description: string;
  objectives: string[];
  skillsAcquired: string[];
  capabilityImprovement: string;
  realWorldApplications: string;
  technologiesInvolved: string[];
  professionalImpact: string;
  experienceGained: string;
}

export interface SkillCategory {
  category: string;
  color: string;
  skills: string[];
}

export const SHAHIR_CV = {
  name: "Muhammad Shahir",
  title: "Sales & Marketing Specialist | AI & Digital Growth Enthusiast",
  location: "Lahore, Punjab, Pakistan",
  email: "iShahirM@gmail.com",
  linkedin: "linkedin.com/in/iShahirM",
  linkedinUrl: "https://linkedin.com/in/iShahirM",
  summary:
    "Results-driven Sales and Marketing Specialist and tech enthusiast with hands-on experience driving business growth, search visibility, and digital presence. Proven expertise in merging modern digital marketing frameworks with Search Engine Optimization (SEO), AI tool automation, and workspace optimization. Adept at interpreting public trends and consumer behavior to design high-converting, search-optimized campaigns, streamline business workflows, and manage client relationships effectively.",
  
  experience: [
    {
      id: "glomore",
      role: "Sales & Marketing Specialist",
      company: "Glomore Pakistan",
      period: "July 2026 – Present",
      bullets: [
        "Dynamically manage end-to-end sales pipelines, driving B2B and B2C direct sales execution and client acquisition on a flexible operations framework.",
        "Integrate advanced search engine optimization (SEO), web analytics, and marketing automation to maximize brand visibility and streamline digital lead generation campaigns.",
        "Implement on-page SEO optimization strategies, keyword research, and data-driven insights to elevate organic search rankings and web traffic.",
        "Leverage generative AI models and prompt engineering frameworks to optimize marketing copy, content strategy, and overall workflow efficiency.",
        "Organize internal operational data, account management pipelines, and team collaboration frameworks using Google Workspace and Microsoft ecosystems."
      ]
    }
  ] as ExperienceItem[],

  education: {
    institution: "The Spirit School (Rizwan Garden Campus)",
    degree: "Matriculation (Curriculum Completion)",
    grade: "Grade A+",
    period: "Completed May 2026",
    bullets: [
      "Maintained exceptional academic standing, developing a solid foundation in analytical methodologies, critical thinking, and collaborative project execution."
    ],
    award: "Recipient of the prestigious Pride of Institution Award (May 2026) for outstanding leadership, top-tier performance, and student community contributions.",
    extracurricular: "Active member of the Green Club Society, leading local climate action initiatives and community environmental sustainability projects."
  } as EducationItem,

  certifications: [
    {
      id: "ai-marketing",
      title: "Online Seminar of AI-Powered Digital Marketing",
      issuer: "Courses & Code (C&C)",
      date: "July 2026",
      category: "ai",
      description: "Focused on integrating machine learning structures, audience behavioral analytics, and AI-driven content generation pipelines to elevate business growth and marketing ROI.",
      objectives: [
        "Master AI-driven predictive audience segmentation and trend analysis",
        "Implement machine learning frameworks in digital ad copy testing",
        "Build scalable content generation workflows for high-intent leads"
      ],
      skillsAcquired: [
        "Predictive Behavioral Analytics",
        "Algorithmic Campaign Strategy",
        "Data-Backed Funnel Optimization",
        "Automated Content Pipelines"
      ],
      capabilityImprovement: "Transformed digital marketing execution from reactive manual scheduling into an automated, intelligence-led growth engine with real-time feedback loops.",
      realWorldApplications: "Optimized organic search and conversion rates for Glomore Pakistan's direct sales campaigns and refined audience intent mapping.",
      technologiesInvolved: ["Google Analytics 4", "Machine Learning Content Models", "SEO Analytics Engines", "Canva AI Suite"],
      professionalImpact: "Empowered strategic decision-making with algorithmic clarity, ensuring that every marketing rupee spent yields measurable audience engagement and high-quality leads.",
      experienceGained: "Deepened expertise in configuring real-time audience tracking pipelines, synthesizing complex search metrics into actionable executive reports, and scaling conversion funnels."
    },
    {
      id: "chatgpt-prompting",
      title: "ChatGPT (Artificial Intelligence) 1.5-Month Digital Skills Training",
      issuer: "Learning With Earning (Pvt) Ltd.",
      date: "Feb 2025",
      category: "ai",
      description: "Comprehensive program specializing in Prompt Engineering, conversational AI integration, automated copy development, and complex workflow optimization.",
      objectives: [
        "Formulate advanced System Instructions and Chain-of-Thought prompts",
        "Automate multi-step research, copy generation, and data extraction",
        "Reduce drafting cycles while elevating semantic accuracy and brand voice"
      ],
      skillsAcquired: [
        "Prompt Engineering Patterns",
        "Conversational AI Orchestration",
        "Automated Copywriting",
        "Context Window Optimization"
      ],
      capabilityImprovement: "Accelerated creative iteration cycles by 70%, allowing rapid deployment of tailored marketing copy, client proposals, and SEO metadata.",
      realWorldApplications: "Crafted automated email outreach scripts, generated keyword-focused blog content, and optimized internal documentation for B2B client pipelines.",
      technologiesInvolved: ["ChatGPT Plus", "OpenAI Playground", "Custom GPT Architectures", "Markdown & Automation Workflows"],
      professionalImpact: "Positioned generative AI as a core collaborative partner rather than a replacement, establishing hyper-efficient content generation standards across all commercial initiatives.",
      experienceGained: "Built robust prompt libraries for marketing campaigns, mastered zero-shot and few-shot contextual framing, and trained colleagues in prompt design best practices."
    },
    {
      id: "canva-creative",
      title: "Canva Certified Creative (CCC-Basic) 1.5-Month Training",
      issuer: "Learning With Earning (Pvt) Ltd.",
      date: "Feb 2025",
      category: "design",
      description: "Developed core skills in visual communication, digital asset creation, brand identity design, and promotional media design frameworks.",
      objectives: [
        "Construct cohesive visual brand identities and multi-platform media kits",
        "Apply typography hierarchy, spatial balance, and color psychology",
        "Produce high-engagement promotional graphics and motion assets"
      ],
      skillsAcquired: [
        "Brand Identity Architecture",
        "Visual Communication Design",
        "Social Media Asset Systems",
        "Marketing Motion Graphics"
      ],
      capabilityImprovement: "Achieved complete visual self-sufficiency, enabling instant translation of campaign strategies into polished, production-ready visual assets.",
      realWorldApplications: "Designed high-converting pitch decks, marketing banners, and promotional social carousels for Glomore Pakistan direct sales initiatives.",
      technologiesInvolved: ["Canva Pro Studio", "Brand Kit Management", "Vector Graphics Tools", "AI Magic Studio"],
      professionalImpact: "Elevated the aesthetic authority and brand consistency of all client touchpoints, boosting ad click-through rates and campaign retention.",
      experienceGained: "Created a comprehensive portfolio of marketing collateral and established rapid visual prototyping techniques for client presentations."
    },
    {
      id: "climate-action",
      title: "Child Driven Climate Action Training & Participation",
      issuer: "Pak Mission Society (In Collaboration with German Cooperation)",
      date: "2023 – 2024",
      category: "climate",
      description: "Acquired training in Renewable Energy, Solid Waste Management, Biodiversity, and Water Conservation; actively advocated for global eco-policy framework goals.",
      objectives: [
        "Understand renewable energy fundamentals and community waste management",
        "Develop youth advocacy programs for biodiversity and water conservation",
        "Mobilize local communities around sustainable environmental policies"
      ],
      skillsAcquired: [
        "Environmental Policy Advocacy",
        "Community Leadership & Organizing",
        "Sustainability Frameworks",
        "Eco-Impact Project Management"
      ],
      capabilityImprovement: "Instilled strong ethical leadership and long-term sustainability thinking into commercial strategies, aligning digital growth with social responsibility.",
      realWorldApplications: "Led local climate campaigns through The Spirit School's Green Club Society, organizing community recycling drives and water conservation awareness workshops.",
      technologiesInvolved: ["Sustainability Impact Tracking", "Community Outreach Platforms", "Eco-Policy Presentation Tools"],
      professionalImpact: "Embedded ESG (Environmental, Social, and Governance) values into daily operational thinking, demonstrating that modern leadership must balance profit with stewardship.",
      experienceGained: "Gained valuable experience communicating environmental goals to diverse audiences, negotiating policy commitments with local authorities, and driving team-based social action."
    }
  ] as CertificationItem[],

  skillCategories: [
    {
      category: "Digital Marketing & Strategy",
      color: "#06b6d4",
      skills: [
        "Search Engine Optimization (SEO)",
        "SEO Optimization",
        "Web Analytics",
        "Lead Generation",
        "Content Strategy",
        "Market Research",
        "B2B & B2C Sales"
      ]
    },
    {
      category: "Artificial Intelligence & Tech",
      color: "#3b82f6",
      skills: [
        "Generative AI Applications",
        "Prompt Engineering (ChatGPT)",
        "Marketing Automation"
      ]
    },
    {
      category: "Design & Infrastructure",
      color: "#a855f7",
      skills: [
        "Canva Design Ecosystem",
        "Visual Communication",
        "Google Workspace Management",
        "Microsoft Accounts & Ecosystems"
      ]
    },
    {
      category: "Interpersonal & Soft Skills",
      color: "#10b981",
      skills: [
        "Critical Thinking",
        "Strategic Leadership",
        "Environmental Advocacy",
        "Public Trends Analysis",
        "Teamwork"
      ]
    }
  ] as SkillCategory[],

  philosophies: [
    {
      title: "Human Imagination + Intelligent Systems",
      quote: "Technology should never replace the human spark; it amplifies curiosity into scalable impact."
    },
    {
      title: "Data-Informed Strategy",
      quote: "Modern marketing is built on listening to consumer intent through analytics and search visibility."
    },
    {
      title: "Continuous Adaptation",
      quote: "Mastery is not a static destination, but an evolving loop of learning, building, and refining."
    },
    {
      title: "Responsible Stewardship",
      quote: "True leadership connects digital innovation with social responsibility and climate action."
    }
  ]
};
