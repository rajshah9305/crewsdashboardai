#!/usr/bin/env python
"""
Intelligent Agent Creator - Minimal Input, Maximum AI Work
Automatically creates comprehensive agent configurations from simple NLP inputs
"""
import re
import json
import yaml
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass, asdict
from pathlib import Path

@dataclass
class AgentSpecification:
    """Complete agent specification generated from minimal input"""
    name: str
    role: str
    goal: str
    backstory: str
    tools: List[str]
    llm_model: str
    temperature: float
    max_iter: int
    reasoning: bool
    allow_delegation: bool
    specializations: List[str]
    performance_metrics: List[str]
    collaboration_style: str
    expertise_level: str

@dataclass
class TaskSpecification:
    """Complete task specification generated from minimal input"""
    name: str
    description: str
    expected_output: str
    agent: str
    context: List[str]
    tools: List[str]
    priority: str
    complexity: str
    success_criteria: List[str]
    deliverables: List[str]
    dependencies: List[str]

class IntelligentAgentCreator:
    """
    Creates comprehensive agent and task configurations from minimal NLP inputs
    """
    
    def __init__(self):
        self.agent_archetypes = self._load_agent_archetypes()
        self.role_templates = self._load_role_templates()
        self.tool_mappings = self._load_tool_mappings()
        self.personality_traits = self._load_personality_traits()
        self.expertise_domains = self._load_expertise_domains()
        
    def _load_agent_archetypes(self) -> Dict:
        """Load predefined agent archetypes for reference"""
        return {
            'analyst': {
                'core_traits': ['analytical', 'detail-oriented', 'data-driven', 'methodical'],
                'typical_goals': ['analyze', 'evaluate', 'assess', 'investigate', 'examine'],
                'backstory_elements': ['research background', 'analytical experience', 'data expertise'],
                'preferred_tools': ['data analysis', 'research', 'visualization'],
                'collaboration_style': 'collaborative',
                'reasoning': True
            },
            'creator': {
                'core_traits': ['creative', 'innovative', 'strategic', 'visionary'],
                'typical_goals': ['create', 'develop', 'design', 'build', 'generate'],
                'backstory_elements': ['creative background', 'design experience', 'innovation focus'],
                'preferred_tools': ['content creation', 'design', 'planning'],
                'collaboration_style': 'independent',
                'reasoning': True
            },
            'coordinator': {
                'core_traits': ['organized', 'strategic', 'leadership', 'systematic'],
                'typical_goals': ['coordinate', 'manage', 'orchestrate', 'organize', 'lead'],
                'backstory_elements': ['management experience', 'coordination expertise', 'leadership skills'],
                'preferred_tools': ['project management', 'communication', 'planning'],
                'collaboration_style': 'delegative',
                'reasoning': True
            },
            'specialist': {
                'core_traits': ['expert', 'focused', 'technical', 'precise'],
                'typical_goals': ['optimize', 'implement', 'execute', 'process', 'deliver'],
                'backstory_elements': ['specialized expertise', 'technical background', 'domain knowledge'],
                'preferred_tools': ['specialized tools', 'technical analysis', 'implementation'],
                'collaboration_style': 'supportive',
                'reasoning': False
            },
            'monitor': {
                'core_traits': ['vigilant', 'systematic', 'reliable', 'thorough'],
                'typical_goals': ['monitor', 'track', 'observe', 'report', 'alert'],
                'backstory_elements': ['monitoring experience', 'quality focus', 'reliability record'],
                'preferred_tools': ['monitoring', 'reporting', 'analysis'],
                'collaboration_style': 'observant',
                'reasoning': False
            },
            'quality_assurer': {
                'core_traits': ['meticulous', 'standards-focused', 'thorough', 'reliable'],
                'typical_goals': ['validate', 'verify', 'ensure', 'check', 'certify'],
                'backstory_elements': ['quality assurance background', 'standards expertise', 'validation experience'],
                'preferred_tools': ['validation', 'testing', 'quality control'],
                'collaboration_style': 'supportive',
                'reasoning': False
            }
        }
    
    def _load_role_templates(self) -> Dict:
        """Load role-specific templates and patterns"""
        return {
            'business': {
                'roles': ['Business Analyst', 'Strategy Consultant', 'Market Researcher', 'Business Developer'],
                'goals': ['analyze market trends', 'develop business strategies', 'identify opportunities'],
                'backstories': ['MBA background', 'consulting experience', 'business analysis expertise'],
                'tools': ['market research', 'financial analysis', 'strategic planning']
            },
            'technology': {
                'roles': ['Technical Architect', 'System Analyst', 'DevOps Engineer', 'Data Engineer'],
                'goals': ['design systems', 'optimize performance', 'ensure reliability'],
                'backstories': ['computer science background', 'software engineering experience', 'technical expertise'],
                'tools': ['system analysis', 'performance monitoring', 'technical documentation']
            },
            'marketing': {
                'roles': ['Marketing Strategist', 'Content Creator', 'Brand Manager', 'Digital Marketer'],
                'goals': ['develop campaigns', 'create content', 'build brand awareness'],
                'backstories': ['marketing background', 'creative experience', 'brand management expertise'],
                'tools': ['content creation', 'social media', 'campaign management']
            },
            'operations': {
                'roles': ['Operations Manager', 'Process Optimizer', 'Quality Manager', 'Project Coordinator'],
                'goals': ['streamline processes', 'ensure quality', 'coordinate activities'],
                'backstories': ['operations background', 'process improvement experience', 'quality management expertise'],
                'tools': ['process mapping', 'quality control', 'project management']
            },
            'research': {
                'roles': ['Research Analyst', 'Data Scientist', 'Intelligence Specialist', 'Information Architect'],
                'goals': ['conduct research', 'analyze data', 'generate insights'],
                'backstories': ['research background', 'analytical experience', 'data science expertise'],
                'tools': ['research tools', 'data analysis', 'information gathering']
            }
        }
    
    def _load_tool_mappings(self) -> Dict:
        """Load tool mappings based on agent functions"""
        return {
            'research': ['ArxivPaperTool', 'ScrapeWebsiteTool', 'FileReadTool'],
            'analysis': ['ScrapeElementFromWebsiteTool', 'FileReadTool'],
            'content': ['FileReadTool', 'ScrapeWebsiteTool'],
            'monitoring': ['FileReadTool'],
            'coordination': ['ScrapeWebsiteTool', 'FileReadTool'],
            'quality': ['FileReadTool'],
            'data_processing': ['ScrapeElementFromWebsiteTool', 'FileReadTool'],
            'web_scraping': ['ScrapeWebsiteTool', 'ScrapeElementFromWebsiteTool'],
            'document_processing': ['FileReadTool'],
            'general': ['ScrapeWebsiteTool', 'FileReadTool']
        }
    
    def _load_personality_traits(self) -> Dict:
        """Load personality traits for different agent types"""
        return {
            'analytical': ['methodical', 'detail-oriented', 'logical', 'systematic', 'thorough'],
            'creative': ['innovative', 'imaginative', 'flexible', 'original', 'visionary'],
            'leadership': ['decisive', 'inspiring', 'strategic', 'confident', 'collaborative'],
            'supportive': ['helpful', 'reliable', 'patient', 'thorough', 'quality-focused'],
            'technical': ['precise', 'logical', 'systematic', 'problem-solving', 'efficient']
        }
    
    def _load_expertise_domains(self) -> Dict:
        """Load expertise domains and their characteristics"""
        return {
            'business_intelligence': {
                'keywords': ['business', 'market', 'strategy', 'analysis', 'intelligence'],
                'specializations': ['market analysis', 'competitive intelligence', 'business strategy'],
                'metrics': ['accuracy', 'insight quality', 'actionability', 'timeliness']
            },
            'data_science': {
                'keywords': ['data', 'analytics', 'statistics', 'machine learning', 'insights'],
                'specializations': ['data analysis', 'statistical modeling', 'predictive analytics'],
                'metrics': ['data accuracy', 'model performance', 'insight generation', 'processing speed']
            },
            'content_creation': {
                'keywords': ['content', 'writing', 'creative', 'marketing', 'communication'],
                'specializations': ['content strategy', 'copywriting', 'brand messaging'],
                'metrics': ['engagement', 'quality', 'relevance', 'creativity']
            },
            'process_optimization': {
                'keywords': ['process', 'optimization', 'efficiency', 'workflow', 'improvement'],
                'specializations': ['process mapping', 'workflow optimization', 'efficiency analysis'],
                'metrics': ['efficiency gain', 'cost reduction', 'time savings', 'quality improvement']
            },
            'quality_assurance': {
                'keywords': ['quality', 'testing', 'validation', 'standards', 'compliance'],
                'specializations': ['quality control', 'testing protocols', 'compliance validation'],
                'metrics': ['defect detection', 'compliance rate', 'accuracy', 'thoroughness']
            }
        }
    
    def create_agent_from_nlp(self, user_input: str) -> AgentSpecification:
        """
        Create comprehensive agent specification from minimal NLP input
        """
        # Parse and understand the input
        parsed_input = self._parse_agent_input(user_input)
        
        # Determine agent archetype
        archetype = self._determine_archetype(parsed_input)
        
        # Generate role and name
        role, name = self._generate_role_and_name(parsed_input, archetype)
        
        # Generate comprehensive goal
        goal = self._generate_goal(parsed_input, archetype, role)
        
        # Generate detailed backstory
        backstory = self._generate_backstory(parsed_input, archetype, role)
        
        # Select appropriate tools
        tools = self._select_tools(parsed_input, archetype)
        
        # Determine LLM configuration
        llm_config = self._determine_llm_config(archetype, parsed_input)
        
        # Generate specializations and metrics
        specializations = self._generate_specializations(parsed_input, archetype)
        metrics = self._generate_performance_metrics(archetype, specializations)
        
        # Determine collaboration style
        collaboration_style = self._determine_collaboration_style(archetype, parsed_input)
        
        return AgentSpecification(
            name=name,
            role=role,
            goal=goal,
            backstory=backstory,
            tools=tools,
            llm_model=llm_config['model'],
            temperature=llm_config['temperature'],
            max_iter=llm_config['max_iter'],
            reasoning=llm_config['reasoning'],
            allow_delegation=llm_config['allow_delegation'],
            specializations=specializations,
            performance_metrics=metrics,
            collaboration_style=collaboration_style,
            expertise_level=self._determine_expertise_level(parsed_input)
        )
    
    def create_task_from_nlp(self, user_input: str, available_agents: List[str] = None) -> TaskSpecification:
        """
        Create comprehensive task specification from minimal NLP input
        """
        # Parse task input
        parsed_input = self._parse_task_input(user_input)
        
        # Generate task name
        name = self._generate_task_name(parsed_input)
        
        # Generate comprehensive description
        description = self._generate_task_description(parsed_input)
        
        # Generate expected output
        expected_output = self._generate_expected_output(parsed_input)
        
        # Select best agent
        agent = self._select_best_agent(parsed_input, available_agents or [])
        
        # Generate context requirements
        context = self._generate_task_context(parsed_input)
        
        # Select task tools
        tools = self._select_task_tools(parsed_input)
        
        # Determine priority and complexity
        priority = self._determine_task_priority(parsed_input)
        complexity = self._determine_task_complexity(parsed_input)
        
        # Generate success criteria
        success_criteria = self._generate_success_criteria(parsed_input)
        
        # Generate deliverables
        deliverables = self._generate_deliverables(parsed_input)
        
        # Identify dependencies
        dependencies = self._identify_dependencies(parsed_input)
        
        return TaskSpecification(
            name=name,
            description=description,
            expected_output=expected_output,
            agent=agent,
            context=context,
            tools=tools,
            priority=priority,
            complexity=complexity,
            success_criteria=success_criteria,
            deliverables=deliverables,
            dependencies=dependencies
        )
    
    def _parse_agent_input(self, user_input: str) -> Dict:
        """Parse user input to extract agent requirements"""
        cleaned_input = user_input.lower().strip()
        
        # Extract key information
        parsed = {
            'raw_input': user_input,
            'cleaned_input': cleaned_input,
            'keywords': self._extract_keywords(cleaned_input),
            'intent': self._extract_intent(cleaned_input),
            'domain': self._extract_domain(cleaned_input),
            'functions': self._extract_functions(cleaned_input),
            'traits': self._extract_traits(cleaned_input),
            'expertise': self._extract_expertise(cleaned_input)
        }
        
        return parsed
    
    def _parse_task_input(self, user_input: str) -> Dict:
        """Parse user input to extract task requirements"""
        cleaned_input = user_input.lower().strip()
        
        parsed = {
            'raw_input': user_input,
            'cleaned_input': cleaned_input,
            'action_words': self._extract_action_words(cleaned_input),
            'subject_matter': self._extract_subject_matter(cleaned_input),
            'scope': self._extract_scope(cleaned_input),
            'urgency': self._extract_urgency(cleaned_input),
            'deliverable_type': self._extract_deliverable_type(cleaned_input),
            'complexity_indicators': self._extract_complexity_indicators(cleaned_input)
        }
        
        return parsed
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract relevant keywords from text"""
        # Common stop words to ignore
        stop_words = {'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with'}
        
        # Extract words, filter stop words and short words
        words = re.findall(r'\b\w+\b', text)
        keywords = [word for word in words if len(word) > 2 and word not in stop_words]
        
        return keywords[:10]  # Limit to top 10 keywords
    
    def _extract_intent(self, text: str) -> str:
        """Extract primary intent from text"""
        intent_patterns = {
            'analyze': ['analyze', 'analysis', 'examine', 'study', 'investigate', 'research'],
            'create': ['create', 'build', 'develop', 'generate', 'produce', 'make'],
            'manage': ['manage', 'coordinate', 'organize', 'lead', 'oversee', 'direct'],
            'optimize': ['optimize', 'improve', 'enhance', 'streamline', 'refine'],
            'monitor': ['monitor', 'track', 'watch', 'observe', 'check'],
            'validate': ['validate', 'verify', 'test', 'ensure', 'confirm']
        }
        
        for intent, patterns in intent_patterns.items():
            if any(pattern in text for pattern in patterns):
                return intent
        
        return 'general'
    
    def _extract_domain(self, text: str) -> str:
        """Extract domain from text"""
        domain_keywords = {
            'business': ['business', 'market', 'sales', 'revenue', 'strategy', 'commercial'],
            'technology': ['tech', 'software', 'system', 'platform', 'digital', 'technical'],
            'marketing': ['marketing', 'brand', 'campaign', 'content', 'social', 'promotion'],
            'operations': ['operations', 'process', 'workflow', 'efficiency', 'logistics'],
            'research': ['research', 'data', 'analysis', 'insights', 'intelligence', 'study']
        }
        
        domain_scores = {}
        for domain, keywords in domain_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text)
            domain_scores[domain] = score
        
        return max(domain_scores, key=domain_scores.get) if max(domain_scores.values()) > 0 else 'general'
    
    def _extract_functions(self, text: str) -> List[str]:
        """Extract functional requirements from text"""
        function_patterns = {
            'research': ['research', 'gather', 'collect', 'find', 'discover'],
            'analysis': ['analyze', 'evaluate', 'assess', 'examine', 'study'],
            'creation': ['create', 'build', 'develop', 'generate', 'produce'],
            'coordination': ['coordinate', 'manage', 'organize', 'orchestrate'],
            'monitoring': ['monitor', 'track', 'observe', 'watch', 'check'],
            'quality_control': ['validate', 'verify', 'test', 'ensure', 'check']
        }
        
        functions = []
        for function, patterns in function_patterns.items():
            if any(pattern in text for pattern in patterns):
                functions.append(function)
        
        return functions or ['general']
    
    def _extract_traits(self, text: str) -> List[str]:
        """Extract personality traits from text"""
        trait_indicators = {
            'analytical': ['analytical', 'logical', 'systematic', 'methodical', 'detailed'],
            'creative': ['creative', 'innovative', 'original', 'imaginative', 'artistic'],
            'leadership': ['leader', 'manager', 'coordinator', 'director', 'supervisor'],
            'technical': ['technical', 'expert', 'specialist', 'skilled', 'proficient'],
            'collaborative': ['team', 'collaborative', 'cooperative', 'social', 'communicative']
        }
        
        traits = []
        for trait, indicators in trait_indicators.items():
            if any(indicator in text for indicator in indicators):
                traits.append(trait)
        
        return traits or ['professional']
    
    def _extract_expertise(self, text: str) -> List[str]:
        """Extract expertise areas from text"""
        expertise_keywords = {
            'data_analysis': ['data', 'analytics', 'statistics', 'metrics', 'insights'],
            'market_research': ['market', 'research', 'competitive', 'industry', 'trends'],
            'content_creation': ['content', 'writing', 'creative', 'messaging', 'communication'],
            'process_optimization': ['process', 'optimization', 'efficiency', 'workflow', 'improvement'],
            'project_management': ['project', 'management', 'coordination', 'planning', 'execution'],
            'quality_assurance': ['quality', 'testing', 'validation', 'standards', 'compliance']
        }
        
        expertise = []
        for area, keywords in expertise_keywords.items():
            if any(keyword in text for keyword in keywords):
                expertise.append(area)
        
        return expertise or ['general']
    
    def _determine_archetype(self, parsed_input: Dict) -> str:
        """Determine the best agent archetype based on parsed input"""
        intent = parsed_input['intent']
        functions = parsed_input['functions']
        traits = parsed_input['traits']
        
        # Score each archetype
        archetype_scores = {}
        
        for archetype, config in self.agent_archetypes.items():
            score = 0
            
            # Check intent alignment
            if any(goal in intent for goal in config['typical_goals']):
                score += 3
            
            # Check function alignment
            for function in functions:
                if function in str(config['preferred_tools']):
                    score += 2
            
            # Check trait alignment
            for trait in traits:
                if trait in config['core_traits']:
                    score += 2
            
            archetype_scores[archetype] = score
        
        return max(archetype_scores, key=archetype_scores.get) if max(archetype_scores.values()) > 0 else 'specialist'
    
    def _generate_role_and_name(self, parsed_input: Dict, archetype: str) -> Tuple[str, str]:
        """Generate role and agent name"""
        domain = parsed_input['domain']
        intent = parsed_input['intent']
        
        # Get domain-specific roles
        domain_roles = self.role_templates.get(domain, {}).get('roles', ['Specialist'])
        
        # Select role based on intent and archetype
        role_mappings = {
            'analyze': 'Analyst',
            'create': 'Creator', 
            'manage': 'Manager',
            'optimize': 'Optimizer',
            'monitor': 'Monitor',
            'validate': 'Quality Specialist'
        }
        
        base_role = role_mappings.get(intent, 'Specialist')
        
        # Combine with domain
        if domain != 'general':
            role = f"{domain.title()} {base_role}"
        else:
            role = base_role
        
        # Generate name from role
        name = role.lower().replace(' ', '_')
        
        return role, name
    
    def _generate_goal(self, parsed_input: Dict, archetype: str, role: str) -> str:
        """Generate comprehensive goal statement"""
        intent = parsed_input['intent']
        domain = parsed_input['domain']
        keywords = parsed_input['keywords']
        
        # Base goal templates
        goal_templates = {
            'analyze': f"Conduct comprehensive {domain} analysis and provide data-driven insights",
            'create': f"Develop high-quality {domain} deliverables and strategic solutions",
            'manage': f"Coordinate and optimize {domain} processes and team activities",
            'optimize': f"Improve {domain} efficiency and performance through systematic optimization",
            'monitor': f"Track and monitor {domain} metrics and performance indicators",
            'validate': f"Ensure {domain} quality and compliance through rigorous validation"
        }
        
        base_goal = goal_templates.get(intent, f"Execute {domain} tasks with excellence")
        
        # Add specific context from keywords
        if keywords:
            relevant_keywords = [kw for kw in keywords if len(kw) > 3][:3]
            if relevant_keywords:
                base_goal += f" focusing on {', '.join(relevant_keywords)}"
        
        # Add archetype-specific enhancements
        archetype_enhancements = {
            'analyst': ". Utilize advanced analytical methodologies and ensure data accuracy.",
            'creator': ". Apply creative problem-solving and innovative approaches.",
            'coordinator': ". Maintain strategic oversight and ensure seamless collaboration.",
            'specialist': ". Leverage deep domain expertise and technical precision.",
            'monitor': ". Provide continuous monitoring and proactive alerting.",
            'quality_assurer': ". Maintain highest quality standards and compliance."
        }
        
        base_goal += archetype_enhancements.get(archetype, ". Deliver exceptional results.")
        
        return base_goal
    
    def _generate_backstory(self, parsed_input: Dict, archetype: str, role: str) -> str:
        """Generate detailed backstory"""
        domain = parsed_input['domain']
        expertise = parsed_input['expertise']
        traits = parsed_input['traits']
        
        # Base backstory templates
        backstory_templates = {
            'business': "With extensive experience in business strategy and market analysis",
            'technology': "Having worked in technology and software development for years",
            'marketing': "With a background in marketing and brand management",
            'operations': "Specializing in operations management and process optimization",
            'research': "With deep expertise in research methodologies and data analysis"
        }
        
        base_backstory = backstory_templates.get(domain, "With professional expertise")
        
        # Add archetype-specific background
        archetype_backgrounds = {
            'analyst': ", you excel at breaking down complex problems and extracting meaningful insights from data",
            'creator': ", you bring innovative thinking and creative solutions to challenging problems",
            'coordinator': ", you have proven leadership skills in managing complex projects and teams",
            'specialist': ", you possess deep technical knowledge and hands-on experience",
            'monitor': ", you have a keen eye for detail and systematic approach to tracking performance",
            'quality_assurer': ", you are meticulous about quality and have extensive validation experience"
        }
        
        base_backstory += archetype_backgrounds.get(archetype, ", you bring professional excellence")
        
        # Add expertise-specific details
        if expertise:
            expertise_details = {
                'data_analysis': "Your analytical skills are complemented by advanced data science techniques",
                'market_research': "You have deep understanding of market dynamics and competitive landscapes",
                'content_creation': "Your creative abilities are enhanced by strategic communication expertise",
                'process_optimization': "You excel at identifying inefficiencies and designing optimal workflows",
                'project_management': "Your organizational skills ensure projects are delivered on time and within scope",
                'quality_assurance': "Your attention to detail ensures all deliverables meet the highest standards"
            }
            
            for exp in expertise[:2]:  # Use top 2 expertise areas
                if exp in expertise_details:
                    base_backstory += f". {expertise_details[exp]}"
        
        # Add personality traits
        if traits:
            trait_descriptions = {
                'analytical': "Your methodical approach ensures thorough analysis",
                'creative': "Your innovative mindset drives original solutions",
                'leadership': "Your leadership qualities inspire team collaboration",
                'technical': "Your technical precision ensures accurate implementation",
                'collaborative': "Your collaborative nature enhances team dynamics"
            }
            
            for trait in traits[:2]:
                if trait in trait_descriptions:
                    base_backstory += f". {trait_descriptions[trait]}"
        
        base_backstory += ". You are committed to delivering exceptional results and continuous improvement."
        
        return base_backstory
    
    def _select_tools(self, parsed_input: Dict, archetype: str) -> List[str]:
        """Select appropriate tools for the agent"""
        functions = parsed_input['functions']
        domain = parsed_input['domain']
        
        selected_tools = []
        
        # Add function-specific tools
        for function in functions:
            if function in self.tool_mappings:
                selected_tools.extend(self.tool_mappings[function])
        
        # Add archetype-specific tools
        archetype_tools = {
            'analyst': ['ScrapeWebsiteTool', 'FileReadTool'],
            'creator': ['FileReadTool', 'ScrapeWebsiteTool'],
            'coordinator': ['ScrapeWebsiteTool', 'FileReadTool'],
            'specialist': ['ScrapeElementFromWebsiteTool', 'FileReadTool'],
            'monitor': ['FileReadTool'],
            'quality_assurer': ['FileReadTool']
        }
        
        if archetype in archetype_tools:
            selected_tools.extend(archetype_tools[archetype])
        
        # Ensure we have at least basic tools
        if not selected_tools:
            selected_tools = ['ScrapeWebsiteTool', 'FileReadTool']
        
        # Remove duplicates and return
        return list(set(selected_tools))
    
    def _determine_llm_config(self, archetype: str, parsed_input: Dict) -> Dict:
        """Determine LLM configuration based on archetype and requirements"""
        base_config = {
            'model': 'groq/llama-3.3-70b-versatile',
            'temperature': 0.7,
            'max_iter': 25,
            'reasoning': True,
            'allow_delegation': True
        }
        
        # Adjust based on archetype
        archetype_configs = {
            'analyst': {'temperature': 0.3, 'reasoning': True, 'allow_delegation': False},
            'creator': {'temperature': 0.8, 'reasoning': True, 'allow_delegation': True},
            'coordinator': {'temperature': 0.5, 'reasoning': True, 'allow_delegation': True},
            'specialist': {'temperature': 0.4, 'reasoning': False, 'allow_delegation': False},
            'monitor': {'temperature': 0.2, 'reasoning': False, 'allow_delegation': False},
            'quality_assurer': {'temperature': 0.3, 'reasoning': False, 'allow_delegation': False}
        }
        
        if archetype in archetype_configs:
            base_config.update(archetype_configs[archetype])
        
        return base_config
    
    def _generate_specializations(self, parsed_input: Dict, archetype: str) -> List[str]:
        """Generate agent specializations"""
        domain = parsed_input['domain']
        expertise = parsed_input['expertise']
        functions = parsed_input['functions']
        
        specializations = []
        
        # Add domain specializations
        domain_specializations = {
            'business': ['Strategic Planning', 'Market Analysis', 'Business Intelligence'],
            'technology': ['System Architecture', 'Technical Analysis', 'Performance Optimization'],
            'marketing': ['Brand Strategy', 'Content Marketing', 'Campaign Management'],
            'operations': ['Process Optimization', 'Quality Management', 'Resource Planning'],
            'research': ['Data Analysis', 'Research Methodology', 'Insight Generation']
        }
        
        if domain in domain_specializations:
            specializations.extend(domain_specializations[domain])
        
        # Add expertise-based specializations
        for exp in expertise:
            if exp in self.expertise_domains:
                specializations.extend(self.expertise_domains[exp]['specializations'])
        
        # Add function-based specializations
        function_specializations = {
            'research': ['Information Gathering', 'Source Validation'],
            'analysis': ['Data Interpretation', 'Pattern Recognition'],
            'creation': ['Solution Design', 'Content Development'],
            'coordination': ['Project Management', 'Team Collaboration'],
            'monitoring': ['Performance Tracking', 'Alert Management'],
            'quality_control': ['Quality Assurance', 'Compliance Validation']
        }
        
        for function in functions:
            if function in function_specializations:
                specializations.extend(function_specializations[function])
        
        return list(set(specializations))[:5]  # Limit to 5 specializations
    
    def _generate_performance_metrics(self, archetype: str, specializations: List[str]) -> List[str]:
        """Generate performance metrics for the agent"""
        base_metrics = ['Task Completion Rate', 'Quality Score', 'Response Time']
        
        archetype_metrics = {
            'analyst': ['Analysis Accuracy', 'Insight Quality', 'Data Coverage'],
            'creator': ['Innovation Score', 'Deliverable Quality', 'Creativity Index'],
            'coordinator': ['Coordination Efficiency', 'Team Satisfaction', 'Project Success Rate'],
            'specialist': ['Technical Accuracy', 'Implementation Success', 'Expertise Application'],
            'monitor': ['Monitoring Coverage', 'Alert Accuracy', 'Uptime Tracking'],
            'quality_assurer': ['Defect Detection Rate', 'Compliance Score', 'Validation Accuracy']
        }
        
        metrics = base_metrics.copy()
        if archetype in archetype_metrics:
            metrics.extend(archetype_metrics[archetype])
        
        return metrics
    
    def _determine_collaboration_style(self, archetype: str, parsed_input: Dict) -> str:
        """Determine collaboration style"""
        archetype_styles = {
            'analyst': 'collaborative',
            'creator': 'independent',
            'coordinator': 'leadership',
            'specialist': 'supportive',
            'monitor': 'observant',
            'quality_assurer': 'supportive'
        }
        
        return archetype_styles.get(archetype, 'collaborative')
    
    def _determine_expertise_level(self, parsed_input: Dict) -> str:
        """Determine expertise level"""
        keywords = parsed_input['keywords']
        expertise = parsed_input['expertise']
        
        # Count expertise indicators
        expertise_indicators = len(expertise) + len([kw for kw in keywords if len(kw) > 5])
        
        if expertise_indicators > 5:
            return 'expert'
        elif expertise_indicators > 3:
            return 'advanced'
        elif expertise_indicators > 1:
            return 'intermediate'
        else:
            return 'professional'
    
    # Task-specific methods
    def _extract_action_words(self, text: str) -> List[str]:
        """Extract action words from task description"""
        action_patterns = [
            'analyze', 'create', 'develop', 'build', 'research', 'investigate',
            'optimize', 'improve', 'monitor', 'track', 'validate', 'verify',
            'generate', 'produce', 'design', 'implement', 'execute', 'deliver'
        ]
        
        return [word for word in action_patterns if word in text]
    
    def _extract_subject_matter(self, text: str) -> str:
        """Extract the main subject matter"""
        # Simple extraction - in a real implementation, this would be more sophisticated
        subjects = ['market', 'business', 'technology', 'content', 'process', 'data', 'system']
        
        for subject in subjects:
            if subject in text:
                return subject
        
        return 'general'
    
    def _extract_scope(self, text: str) -> str:
        """Extract task scope"""
        scope_indicators = {
            'comprehensive': ['comprehensive', 'complete', 'full', 'detailed', 'thorough'],
            'focused': ['specific', 'targeted', 'focused', 'particular'],
            'broad': ['broad', 'wide', 'extensive', 'general', 'overall']
        }
        
        for scope, indicators in scope_indicators.items():
            if any(indicator in text for indicator in indicators):
                return scope
        
        return 'standard'
    
    def _extract_urgency(self, text: str) -> str:
        """Extract urgency level"""
        urgency_indicators = {
            'urgent': ['urgent', 'asap', 'immediately', 'critical', 'emergency'],
            'high': ['important', 'priority', 'soon', 'quickly'],
            'low': ['when possible', 'eventually', 'background']
        }
        
        for urgency, indicators in urgency_indicators.items():
            if any(indicator in text for indicator in indicators):
                return urgency
        
        return 'medium'
    
    def _extract_deliverable_type(self, text: str) -> str:
        """Extract expected deliverable type"""
        deliverable_types = {
            'report': ['report', 'analysis', 'summary', 'findings'],
            'plan': ['plan', 'strategy', 'roadmap', 'framework'],
            'content': ['content', 'material', 'copy', 'text'],
            'data': ['data', 'dataset', 'metrics', 'statistics'],
            'documentation': ['documentation', 'guide', 'manual', 'specs']
        }
        
        for deliverable, indicators in deliverable_types.items():
            if any(indicator in text for indicator in indicators):
                return deliverable
        
        return 'general'
    
    def _extract_complexity_indicators(self, text: str) -> List[str]:
        """Extract complexity indicators"""
        complexity_words = [
            'complex', 'comprehensive', 'detailed', 'thorough', 'extensive',
            'multi-faceted', 'in-depth', 'sophisticated', 'advanced'
        ]
        
        return [word for word in complexity_words if word in text]
    
    def _generate_task_name(self, parsed_input: Dict) -> str:
        """Generate task name"""
        action_words = parsed_input['action_words']
        subject_matter = parsed_input['subject_matter']
        
        if action_words and subject_matter:
            return f"{action_words[0].title()} {subject_matter.title()}"
        elif action_words:
            return f"{action_words[0].title()} Task"
        else:
            return "Custom Task"
    
    def _generate_task_description(self, parsed_input: Dict) -> str:
        """Generate comprehensive task description"""
        raw_input = parsed_input['raw_input']
        scope = parsed_input['scope']
        subject_matter = parsed_input['subject_matter']
        
        # Expand the original input
        base_description = f"Execute {raw_input.lower()}"
        
        # Add scope-based enhancements
        scope_enhancements = {
            'comprehensive': " with thorough analysis and detailed documentation",
            'focused': " with targeted approach and specific deliverables",
            'broad': " with wide coverage and extensive research"
        }
        
        if scope in scope_enhancements:
            base_description += scope_enhancements[scope]
        
        # Add subject-specific requirements
        subject_requirements = {
            'market': ". Include competitive analysis, trend identification, and strategic recommendations.",
            'business': ". Provide business impact analysis, ROI considerations, and implementation guidance.",
            'technology': ". Include technical specifications, architecture considerations, and implementation details.",
            'content': ". Ensure brand alignment, audience targeting, and engagement optimization.",
            'process': ". Include efficiency analysis, optimization recommendations, and implementation roadmap.",
            'data': ". Provide data validation, statistical analysis, and actionable insights."
        }
        
        if subject_matter in subject_requirements:
            base_description += subject_requirements[subject_matter]
        else:
            base_description += ". Ensure high quality deliverables with actionable recommendations."
        
        return base_description
    
    def _generate_expected_output(self, parsed_input: Dict) -> str:
        """Generate expected output description"""
        deliverable_type = parsed_input['deliverable_type']
        scope = parsed_input['scope']
        
        output_templates = {
            'report': f"A {scope} report with executive summary, detailed analysis, findings, and recommendations",
            'plan': f"A {scope} strategic plan with objectives, timeline, resources, and implementation steps",
            'content': f"{scope.title()} content materials with supporting documentation and usage guidelines",
            'data': f"Processed data with {scope} analysis, visualizations, and statistical insights",
            'documentation': f"{scope.title()} documentation with specifications, procedures, and best practices"
        }
        
        return output_templates.get(deliverable_type, f"A {scope} deliverable with supporting documentation and recommendations")
    
    def _select_best_agent(self, parsed_input: Dict, available_agents: List[str]) -> str:
        """Select the best agent for the task"""
        action_words = parsed_input['action_words']
        subject_matter = parsed_input['subject_matter']
        
        # Agent selection logic based on task characteristics
        agent_preferences = {
            'analyze': 'research_intelligence_agent',
            'research': 'research_intelligence_agent',
            'create': 'orchestration_coordinator',
            'develop': 'orchestration_coordinator',
            'optimize': 'data_processing_specialist',
            'monitor': 'execution_monitor',
            'validate': 'quality_assurance_specialist'
        }
        
        # Try to match action words
        for action in action_words:
            if action in agent_preferences:
                preferred_agent = agent_preferences[action]
                if preferred_agent in available_agents:
                    return preferred_agent
        
        # Default to orchestration coordinator
        return 'orchestration_coordinator' if 'orchestration_coordinator' in available_agents else (available_agents[0] if available_agents else 'orchestration_coordinator')
    
    def _generate_task_context(self, parsed_input: Dict) -> List[str]:
        """Generate task context requirements"""
        subject_matter = parsed_input['subject_matter']
        scope = parsed_input['scope']
        
        base_context = ["Previous task outputs and learnings", "Relevant domain knowledge and best practices"]
        
        subject_contexts = {
            'market': ["Market data and industry reports", "Competitive landscape information"],
            'business': ["Business metrics and KPIs", "Strategic objectives and constraints"],
            'technology': ["Technical specifications and requirements", "System architecture and constraints"],
            'content': ["Brand guidelines and messaging", "Audience insights and preferences"],
            'process': ["Current process documentation", "Performance metrics and benchmarks"],
            'data': ["Data sources and quality requirements", "Analysis frameworks and methodologies"]
        }
        
        if subject_matter in subject_contexts:
            base_context.extend(subject_contexts[subject_matter])
        
        return base_context
    
    def _select_task_tools(self, parsed_input: Dict) -> List[str]:
        """Select tools for the task"""
        action_words = parsed_input['action_words']
        subject_matter = parsed_input['subject_matter']
        
        tools = []
        
        # Add action-based tools
        action_tools = {
            'research': ['ScrapeWebsiteTool', 'ArxivPaperTool'],
            'analyze': ['FileReadTool', 'ScrapeElementFromWebsiteTool'],
            'create': ['FileReadTool'],
            'monitor': ['FileReadTool']
        }
        
        for action in action_words:
            if action in action_tools:
                tools.extend(action_tools[action])
        
        # Add subject-based tools
        subject_tools = {
            'market': ['ScrapeWebsiteTool', 'ArxivPaperTool'],
            'data': ['ScrapeElementFromWebsiteTool', 'FileReadTool'],
            'content': ['FileReadTool', 'ScrapeWebsiteTool']
        }
        
        if subject_matter in subject_tools:
            tools.extend(subject_tools[subject_matter])
        
        # Ensure we have at least basic tools
        if not tools:
            tools = ['FileReadTool', 'ScrapeWebsiteTool']
        
        return list(set(tools))
    
    def _determine_task_priority(self, parsed_input: Dict) -> str:
        """Determine task priority"""
        urgency = parsed_input['urgency']
        complexity_indicators = parsed_input['complexity_indicators']
        
        if urgency == 'urgent':
            return 'urgent'
        elif urgency == 'high' or len(complexity_indicators) > 2:
            return 'high'
        elif urgency == 'low':
            return 'low'
        else:
            return 'medium'
    
    def _determine_task_complexity(self, parsed_input: Dict) -> str:
        """Determine task complexity"""
        complexity_indicators = parsed_input['complexity_indicators']
        scope = parsed_input['scope']
        action_words = parsed_input['action_words']
        
        complexity_score = len(complexity_indicators) + len(action_words)
        
        if scope == 'comprehensive':
            complexity_score += 2
        elif scope == 'broad':
            complexity_score += 1
        
        if complexity_score > 5:
            return 'high'
        elif complexity_score > 3:
            return 'medium'
        else:
            return 'low'
    
    def _generate_success_criteria(self, parsed_input: Dict) -> List[str]:
        """Generate success criteria"""
        deliverable_type = parsed_input['deliverable_type']
        scope = parsed_input['scope']
        
        base_criteria = [
            "All requirements met and deliverables completed",
            "Quality standards achieved and validated",
            "Stakeholder expectations satisfied"
        ]
        
        type_criteria = {
            'report': ["Data accuracy verified", "Insights are actionable", "Recommendations are feasible"],
            'plan': ["Objectives are clear and measurable", "Timeline is realistic", "Resources are identified"],
            'content': ["Brand guidelines followed", "Audience engagement optimized", "Message clarity achieved"],
            'data': ["Data quality validated", "Analysis methodology sound", "Results are reproducible"],
            'documentation': ["Information is complete", "Procedures are clear", "Standards are met"]
        }
        
        if deliverable_type in type_criteria:
            base_criteria.extend(type_criteria[deliverable_type])
        
        return base_criteria
    
    def _generate_deliverables(self, parsed_input: Dict) -> List[str]:
        """Generate list of deliverables"""
        deliverable_type = parsed_input['deliverable_type']
        scope = parsed_input['scope']
        
        base_deliverables = ["Primary deliverable as specified"]
        
        type_deliverables = {
            'report': ["Executive summary", "Detailed analysis report", "Supporting data and charts", "Recommendations document"],
            'plan': ["Strategic plan document", "Implementation timeline", "Resource requirements", "Risk assessment"],
            'content': ["Content materials", "Style guide", "Usage instructions", "Performance metrics"],
            'data': ["Processed dataset", "Analysis results", "Visualizations", "Methodology documentation"],
            'documentation': ["Technical documentation", "User guide", "Best practices", "Maintenance procedures"]
        }
        
        if deliverable_type in type_deliverables:
            return type_deliverables[deliverable_type]
        
        return base_deliverables
    
    def _identify_dependencies(self, parsed_input: Dict) -> List[str]:
        """Identify task dependencies"""
        subject_matter = parsed_input['subject_matter']
        scope = parsed_input['scope']
        
        base_dependencies = ["Access to relevant data sources", "Stakeholder input and requirements"]
        
        subject_dependencies = {
            'market': ["Market data access", "Industry reports", "Competitive intelligence"],
            'business': ["Business metrics", "Strategic objectives", "Financial data"],
            'technology': ["Technical specifications", "System access", "Architecture documentation"],
            'content': ["Brand guidelines", "Audience data", "Content standards"],
            'process': ["Process documentation", "Performance data", "Stakeholder interviews"],
            'data': ["Data sources", "Analysis tools", "Quality standards"]
        }
        
        if subject_matter in subject_dependencies:
            base_dependencies.extend(subject_dependencies[subject_matter])
        
        return base_dependencies
    
    def save_agent_config(self, agent_spec: AgentSpecification, config_path: str = None) -> str:
        """Save agent configuration to YAML file"""
        if not config_path:
            config_path = f"src/ai_agent_orchestration_hub/config/agents.yaml"
        
        # Load existing config or create new
        config_file = Path(config_path)
        if config_file.exists():
            with open(config_file, 'r') as f:
                config = yaml.safe_load(f) or {}
        else:
            config = {}
        
        # Add new agent
        config[agent_spec.name] = {
            'role': agent_spec.role,
            'goal': agent_spec.goal,
            'backstory': agent_spec.backstory
        }
        
        # Save updated config
        with open(config_file, 'w') as f:
            yaml.dump(config, f, default_flow_style=False, sort_keys=False)
        
        return str(config_file)
    
    def save_task_config(self, task_spec: TaskSpecification, config_path: str = None) -> str:
        """Save task configuration to YAML file"""
        if not config_path:
            config_path = f"src/ai_agent_orchestration_hub/config/tasks.yaml"
        
        # Load existing config or create new
        config_file = Path(config_path)
        if config_file.exists():
            with open(config_file, 'r') as f:
                config = yaml.safe_load(f) or {}
        else:
            config = {}
        
        # Add new task
        config[task_spec.name.lower().replace(' ', '_')] = {
            'description': task_spec.description,
            'expected_output': task_spec.expected_output,
            'agent': task_spec.agent
        }
        
        if task_spec.context:
            config[task_spec.name.lower().replace(' ', '_')]['context'] = task_spec.context
        
        # Save updated config
        with open(config_file, 'w') as f:
            yaml.dump(config, f, default_flow_style=False, sort_keys=False)
        
        return str(config_file)

# Global instance for use across the application
intelligent_agent_creator = IntelligentAgentCreator()