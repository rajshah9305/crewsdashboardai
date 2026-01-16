#!/usr/bin/env python
"""
Intelligent Orchestrator - Minimal Input, Maximum AI Work
Automatically expands simple user inputs into comprehensive task specifications
"""
import re
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass

@dataclass
class TaskExpansion:
    """Expanded task specification from minimal user input"""
    original_input: str
    expanded_description: str
    category: str
    priority: str
    estimated_duration: str
    required_agents: List[str]
    subtasks: List[str]
    expected_outputs: List[str]
    success_criteria: List[str]
    context_requirements: List[str]

class IntelligentOrchestrator:
    """
    Automatically expands minimal user inputs into comprehensive task specifications
    """
    
    def __init__(self):
        self.intent_patterns = self._load_intent_patterns()
        self.domain_knowledge = self._load_domain_knowledge()
        self.task_templates = self._load_task_templates()
    
    def _load_intent_patterns(self) -> Dict:
        """Load patterns for understanding user intent"""
        return {
            'research': {
                'keywords': ['research', 'analyze', 'study', 'investigate', 'explore', 'examine', 'review'],
                'indicators': ['trends', 'market', 'competitors', 'industry', 'data', 'information'],
                'default_priority': 'medium',
                'estimated_duration': '2-4 hours'
            },
            'create': {
                'keywords': ['create', 'build', 'develop', 'design', 'make', 'generate', 'produce'],
                'indicators': ['plan', 'strategy', 'document', 'report', 'presentation', 'content'],
                'default_priority': 'high',
                'estimated_duration': '3-6 hours'
            },
            'optimize': {
                'keywords': ['optimize', 'improve', 'enhance', 'refine', 'streamline', 'upgrade'],
                'indicators': ['process', 'workflow', 'performance', 'efficiency', 'system'],
                'default_priority': 'medium',
                'estimated_duration': '4-8 hours'
            },
            'monitor': {
                'keywords': ['monitor', 'track', 'watch', 'observe', 'check', 'audit'],
                'indicators': ['performance', 'metrics', 'status', 'health', 'compliance'],
                'default_priority': 'low',
                'estimated_duration': '1-2 hours'
            },
            'automate': {
                'keywords': ['automate', 'schedule', 'batch', 'recurring', 'systematic'],
                'indicators': ['process', 'workflow', 'task', 'operation', 'routine'],
                'default_priority': 'high',
                'estimated_duration': '6-12 hours'
            }
        }
    
    def _load_domain_knowledge(self) -> Dict:
        """Load domain-specific knowledge for context expansion"""
        return {
            'business': {
                'contexts': ['market analysis', 'competitive intelligence', 'financial planning', 'strategic planning'],
                'outputs': ['executive summary', 'detailed report', 'recommendations', 'action items'],
                'agents': ['research_intelligence_agent', 'data_processing_specialist', 'quality_assurance_specialist']
            },
            'technology': {
                'contexts': ['system architecture', 'performance optimization', 'security analysis', 'integration planning'],
                'outputs': ['technical specifications', 'implementation plan', 'risk assessment', 'documentation'],
                'agents': ['data_processing_specialist', 'execution_monitor', 'quality_assurance_specialist']
            },
            'marketing': {
                'contexts': ['audience analysis', 'campaign planning', 'content strategy', 'brand positioning'],
                'outputs': ['marketing plan', 'content calendar', 'campaign metrics', 'brand guidelines'],
                'agents': ['research_intelligence_agent', 'orchestration_coordinator', 'quality_assurance_specialist']
            },
            'operations': {
                'contexts': ['process optimization', 'resource allocation', 'workflow design', 'quality control'],
                'outputs': ['process documentation', 'efficiency metrics', 'optimization recommendations', 'SOPs'],
                'agents': ['task_allocation_manager', 'execution_monitor', 'quality_assurance_specialist']
            }
        }
    
    def _load_task_templates(self) -> Dict:
        """Load pre-built task templates for common scenarios"""
        return {
            'market_research': {
                'description': 'Comprehensive market research and competitive analysis',
                'subtasks': [
                    'Industry landscape analysis',
                    'Competitor identification and profiling',
                    'Market size and growth trends',
                    'Customer segment analysis',
                    'Pricing strategy evaluation',
                    'SWOT analysis compilation'
                ],
                'outputs': ['Market research report', 'Competitor analysis matrix', 'Strategic recommendations'],
                'success_criteria': ['Data accuracy >95%', 'Comprehensive coverage', 'Actionable insights']
            },
            'content_strategy': {
                'description': 'Develop comprehensive content marketing strategy',
                'subtasks': [
                    'Audience persona development',
                    'Content audit and gap analysis',
                    'Editorial calendar creation',
                    'Content format optimization',
                    'Distribution channel strategy',
                    'Performance metrics definition'
                ],
                'outputs': ['Content strategy document', 'Editorial calendar', 'Content guidelines'],
                'success_criteria': ['Audience alignment', 'Scalable framework', 'Measurable KPIs']
            },
            'process_optimization': {
                'description': 'Analyze and optimize business processes for efficiency',
                'subtasks': [
                    'Current process mapping',
                    'Bottleneck identification',
                    'Efficiency metrics analysis',
                    'Optimization recommendations',
                    'Implementation roadmap',
                    'Success metrics definition'
                ],
                'outputs': ['Process analysis report', 'Optimization plan', 'Implementation guide'],
                'success_criteria': ['Efficiency improvement >20%', 'Cost reduction', 'Quality maintenance']
            }
        }
    
    def expand_user_input(self, user_input: str) -> TaskExpansion:
        """
        Expand minimal user input into comprehensive task specification
        """
        # Clean and normalize input
        cleaned_input = self._clean_input(user_input)
        
        # Detect intent and domain
        intent = self._detect_intent(cleaned_input)
        domain = self._detect_domain(cleaned_input)
        
        # Extract key entities
        entities = self._extract_entities(cleaned_input)
        
        # Generate expanded description
        expanded_description = self._generate_expanded_description(
            cleaned_input, intent, domain, entities
        )
        
        # Determine task parameters
        category = self._determine_category(intent, domain)
        priority = self._determine_priority(cleaned_input, intent)
        duration = self._estimate_duration(intent, entities)
        
        # Select required agents
        required_agents = self._select_agents(intent, domain, entities)
        
        # Generate subtasks
        subtasks = self._generate_subtasks(intent, domain, entities)
        
        # Define expected outputs
        expected_outputs = self._define_outputs(intent, domain, entities)
        
        # Set success criteria
        success_criteria = self._define_success_criteria(intent, domain)
        
        # Identify context requirements
        context_requirements = self._identify_context_requirements(domain, entities)
        
        return TaskExpansion(
            original_input=user_input,
            expanded_description=expanded_description,
            category=category,
            priority=priority,
            estimated_duration=duration,
            required_agents=required_agents,
            subtasks=subtasks,
            expected_outputs=expected_outputs,
            success_criteria=success_criteria,
            context_requirements=context_requirements
        )
    
    def _clean_input(self, user_input: str) -> str:
        """Clean and normalize user input"""
        # Remove extra whitespace and normalize case
        cleaned = ' '.join(user_input.strip().split())
        return cleaned.lower()
    
    def _detect_intent(self, input_text: str) -> str:
        """Detect user intent from input text"""
        intent_scores = {}
        
        for intent, config in self.intent_patterns.items():
            score = 0
            
            # Check for intent keywords
            for keyword in config['keywords']:
                if keyword in input_text:
                    score += 3
            
            # Check for intent indicators
            for indicator in config['indicators']:
                if indicator in input_text:
                    score += 2
            
            intent_scores[intent] = score
        
        # Return highest scoring intent, default to 'research'
        return max(intent_scores, key=intent_scores.get) if max(intent_scores.values()) > 0 else 'research'
    
    def _detect_domain(self, input_text: str) -> str:
        """Detect domain context from input text"""
        domain_keywords = {
            'business': ['business', 'market', 'revenue', 'profit', 'sales', 'customer', 'competitor'],
            'technology': ['tech', 'software', 'system', 'platform', 'api', 'database', 'cloud'],
            'marketing': ['marketing', 'brand', 'campaign', 'content', 'social', 'advertising'],
            'operations': ['process', 'workflow', 'operation', 'efficiency', 'quality', 'resource']
        }
        
        domain_scores = {}
        for domain, keywords in domain_keywords.items():
            score = sum(1 for keyword in keywords if keyword in input_text)
            domain_scores[domain] = score
        
        return max(domain_scores, key=domain_scores.get) if max(domain_scores.values()) > 0 else 'business'
    
    def _extract_entities(self, input_text: str) -> Dict:
        """Extract key entities from input text"""
        entities = {
            'companies': [],
            'industries': [],
            'timeframes': [],
            'metrics': [],
            'technologies': []
        }
        
        # Simple entity extraction patterns
        company_patterns = [r'\b[A-Z][a-z]+ (?:Inc|Corp|LLC|Ltd)\b', r'\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b']
        industry_patterns = [r'\b(?:healthcare|finance|retail|technology|manufacturing|education)\b']
        timeframe_patterns = [r'\b(?:daily|weekly|monthly|quarterly|yearly|2024|2025)\b']
        
        for pattern in company_patterns:
            entities['companies'].extend(re.findall(pattern, input_text))
        
        for pattern in industry_patterns:
            entities['industries'].extend(re.findall(pattern, input_text))
        
        for pattern in timeframe_patterns:
            entities['timeframes'].extend(re.findall(pattern, input_text))
        
        return entities
    
    def _generate_expanded_description(self, input_text: str, intent: str, domain: str, entities: Dict) -> str:
        """Generate comprehensive task description from minimal input"""
        base_templates = {
            'research': f"Conduct comprehensive {domain} research and analysis",
            'create': f"Develop and create {domain} deliverables and documentation",
            'optimize': f"Analyze and optimize {domain} processes and performance",
            'monitor': f"Monitor and track {domain} metrics and performance indicators",
            'automate': f"Design and implement automated {domain} workflows and processes"
        }
        
        base_description = base_templates.get(intent, f"Execute {domain} task")
        
        # Add entity-specific context
        if entities['companies']:
            base_description += f" focusing on {', '.join(entities['companies'][:3])}"
        
        if entities['industries']:
            base_description += f" within the {', '.join(entities['industries'])} sector(s)"
        
        if entities['timeframes']:
            base_description += f" with {entities['timeframes'][0]} timeline considerations"
        
        # Add comprehensive scope
        scope_additions = {
            'research': ". Include market analysis, competitive landscape, trend identification, and strategic recommendations with supporting data and visualizations.",
            'create': ". Develop comprehensive documentation, strategic plans, implementation guides, and supporting materials with quality assurance.",
            'optimize': ". Perform thorough analysis, identify improvement opportunities, design optimized processes, and create implementation roadmaps.",
            'monitor': ". Establish monitoring frameworks, define KPIs, create dashboards, and provide regular performance reports with insights.",
            'automate': ". Design automated workflows, implement process improvements, create monitoring systems, and provide maintenance documentation."
        }
        
        base_description += scope_additions.get(intent, ". Provide comprehensive analysis and actionable recommendations.")
        
        return base_description
    
    def _determine_category(self, intent: str, domain: str) -> str:
        """Determine task category based on intent and domain"""
        category_mapping = {
            ('research', 'business'): 'market_research',
            ('research', 'technology'): 'technical_analysis',
            ('create', 'marketing'): 'content_creation',
            ('create', 'business'): 'strategic_planning',
            ('optimize', 'operations'): 'process_optimization',
            ('monitor', 'technology'): 'system_monitoring'
        }
        
        return category_mapping.get((intent, domain), 'general_analysis')
    
    def _determine_priority(self, input_text: str, intent: str) -> str:
        """Determine task priority based on input and intent"""
        urgency_keywords = {
            'urgent': ['urgent', 'asap', 'immediately', 'critical', 'emergency'],
            'high': ['important', 'priority', 'soon', 'quickly', 'fast'],
            'low': ['when possible', 'eventually', 'low priority', 'background']
        }
        
        for priority, keywords in urgency_keywords.items():
            if any(keyword in input_text for keyword in keywords):
                return priority
        
        # Default based on intent
        return self.intent_patterns.get(intent, {}).get('default_priority', 'medium')
    
    def _estimate_duration(self, intent: str, entities: Dict) -> str:
        """Estimate task duration based on complexity"""
        base_duration = self.intent_patterns.get(intent, {}).get('estimated_duration', '2-4 hours')
        
        # Adjust based on complexity indicators
        complexity_factors = len(entities['companies']) + len(entities['industries']) + len(entities['timeframes'])
        
        if complexity_factors > 5:
            return "8-16 hours"
        elif complexity_factors > 3:
            return "4-8 hours"
        else:
            return base_duration
    
    def _select_agents(self, intent: str, domain: str, entities: Dict) -> List[str]:
        """Select required agents based on task requirements"""
        base_agents = ['orchestration_coordinator']  # Always include coordinator
        
        # Add domain-specific agents
        domain_agents = self.domain_knowledge.get(domain, {}).get('agents', [])
        base_agents.extend(domain_agents)
        
        # Add intent-specific agents
        intent_agent_mapping = {
            'research': ['research_intelligence_agent'],
            'create': ['data_processing_specialist'],
            'optimize': ['execution_monitor'],
            'monitor': ['execution_monitor'],
            'automate': ['task_allocation_manager']
        }
        
        intent_agents = intent_agent_mapping.get(intent, [])
        base_agents.extend(intent_agents)
        
        # Always include QA for comprehensive tasks
        if len(entities['companies']) > 0 or len(entities['industries']) > 0:
            base_agents.append('quality_assurance_specialist')
        
        return list(set(base_agents))  # Remove duplicates
    
    def _generate_subtasks(self, intent: str, domain: str, entities: Dict) -> List[str]:
        """Generate comprehensive subtasks"""
        base_subtasks = [
            "Initial requirements analysis and scope definition",
            "Data collection and information gathering",
            "Analysis and processing of collected information",
            "Synthesis and insight generation",
            "Quality validation and verification",
            "Final deliverable compilation and formatting"
        ]
        
        # Add domain-specific subtasks
        domain_subtasks = {
            'business': [
                "Market landscape analysis",
                "Competitive intelligence gathering",
                "Financial and performance metrics analysis",
                "Strategic recommendations development"
            ],
            'technology': [
                "Technical requirements assessment",
                "System architecture analysis",
                "Performance and security evaluation",
                "Implementation planning and documentation"
            ],
            'marketing': [
                "Audience and persona analysis",
                "Content strategy development",
                "Channel optimization planning",
                "Campaign performance metrics definition"
            ],
            'operations': [
                "Process mapping and documentation",
                "Efficiency bottleneck identification",
                "Resource optimization analysis",
                "Implementation roadmap creation"
            ]
        }
        
        domain_specific = domain_subtasks.get(domain, [])
        
        # Combine and customize based on entities
        all_subtasks = base_subtasks + domain_specific
        
        if entities['companies']:
            all_subtasks.append(f"Company-specific analysis for {', '.join(entities['companies'][:2])}")
        
        if entities['industries']:
            all_subtasks.append(f"Industry-specific considerations for {entities['industries'][0]}")
        
        return all_subtasks[:10]  # Limit to 10 subtasks for manageability
    
    def _define_outputs(self, intent: str, domain: str, entities: Dict) -> List[str]:
        """Define expected outputs and deliverables"""
        base_outputs = [
            "Executive summary with key findings",
            "Detailed analysis report",
            "Actionable recommendations",
            "Supporting data and visualizations"
        ]
        
        # Add domain-specific outputs
        domain_outputs = self.domain_knowledge.get(domain, {}).get('outputs', [])
        
        # Add intent-specific outputs
        intent_outputs = {
            'research': ["Research methodology documentation", "Data source bibliography"],
            'create': ["Implementation guide", "Best practices documentation"],
            'optimize': ["Performance improvement metrics", "ROI analysis"],
            'monitor': ["Monitoring dashboard", "Alert configuration guide"],
            'automate': ["Automation workflow documentation", "Maintenance procedures"]
        }
        
        specific_outputs = intent_outputs.get(intent, [])
        
        return base_outputs + domain_outputs + specific_outputs
    
    def _define_success_criteria(self, intent: str, domain: str) -> List[str]:
        """Define success criteria for task completion"""
        base_criteria = [
            "All deliverables completed to specification",
            "Quality standards met or exceeded",
            "Stakeholder requirements satisfied",
            "Documentation comprehensive and clear"
        ]
        
        intent_criteria = {
            'research': [
                "Data accuracy verified and validated",
                "Multiple reliable sources consulted",
                "Insights are actionable and relevant"
            ],
            'create': [
                "Deliverables are production-ready",
                "All requirements implemented",
                "User acceptance criteria met"
            ],
            'optimize': [
                "Measurable improvement achieved",
                "Implementation feasibility confirmed",
                "Cost-benefit analysis positive"
            ],
            'monitor': [
                "Monitoring coverage is comprehensive",
                "Alerts are properly configured",
                "Reporting is automated and reliable"
            ],
            'automate': [
                "Automation reduces manual effort by >50%",
                "Error rates decreased",
                "Process reliability improved"
            ]
        }
        
        return base_criteria + intent_criteria.get(intent, [])
    
    def _identify_context_requirements(self, domain: str, entities: Dict) -> List[str]:
        """Identify additional context requirements"""
        requirements = [
            "Access to relevant data sources and databases",
            "Industry best practices and standards",
            "Regulatory and compliance considerations"
        ]
        
        if entities['companies']:
            requirements.append("Company-specific information and documentation")
        
        if entities['industries']:
            requirements.append(f"Industry-specific knowledge for {entities['industries'][0]}")
        
        domain_requirements = {
            'business': ["Financial data and market reports", "Competitive intelligence sources"],
            'technology': ["Technical specifications and documentation", "System architecture details"],
            'marketing': ["Brand guidelines and messaging", "Audience data and analytics"],
            'operations': ["Process documentation and workflows", "Performance metrics and KPIs"]
        }
        
        requirements.extend(domain_requirements.get(domain, []))
        
        return requirements

# Global instance for use across the application
intelligent_orchestrator = IntelligentOrchestrator()