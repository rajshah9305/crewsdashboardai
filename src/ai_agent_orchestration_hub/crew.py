import os
import json
from pathlib import Path

from crewai import LLM
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import (
    ArxivPaperTool,
    ScrapeWebsiteTool,
    ScrapeElementFromWebsiteTool,
    FileReadTool
)





@CrewBase
class AiAgentOrchestrationHubCrew:
    """AiAgentOrchestrationHub crew"""

    
    @agent
    def orchestration_coordinator(self) -> Agent:
        
        return Agent(
            config=self.agents_config["orchestration_coordinator"],
            
            
            tools=[				ScrapeWebsiteTool(),
				FileReadTool()],
            reasoning=True,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=True,
            max_iter=25,
            max_rpm=None,
            
            max_execution_time=None,
            llm=LLM(
                model="groq/llama-3.3-70b-versatile",
                temperature=0.7,
            ),
            
        )
    
    @agent
    def research_intelligence_agent(self) -> Agent:
        
        return Agent(
            config=self.agents_config["research_intelligence_agent"],
            
            
            tools=[				ArxivPaperTool(),
				ScrapeWebsiteTool()],
            reasoning=True,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=True,
            max_iter=25,
            max_rpm=None,
            
            max_execution_time=None,
            llm=LLM(
                model="groq/llama-3.3-70b-versatile",
                temperature=0.7,
            ),
            
        )
    
    @agent
    def quality_assurance_specialist(self) -> Agent:
        
        return Agent(
            config=self.agents_config["quality_assurance_specialist"],
            
            
            tools=[				FileReadTool()],
            reasoning=True,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=True,
            max_iter=25,
            max_rpm=None,
            
            max_execution_time=None,
            llm=LLM(
                model="groq/llama-3.3-70b-versatile",
                temperature=0.7,
            ),
            
        )
    
    @agent
    def task_allocation_manager(self) -> Agent:
        
        return Agent(
            config=self.agents_config["task_allocation_manager"],
            
            
            tools=[				ScrapeWebsiteTool()],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            max_execution_time=None,
            llm=LLM(
                model="groq/llama-3.3-70b-versatile",
                temperature=0.7,
            ),
            
        )
    
    @agent
    def data_processing_specialist(self) -> Agent:
        
        return Agent(
            config=self.agents_config["data_processing_specialist"],
            
            
            tools=[				ScrapeElementFromWebsiteTool(),
				FileReadTool()],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            max_execution_time=None,
            llm=LLM(
                model="groq/llama-3.3-70b-versatile",
                temperature=0.7,
            ),
            
        )
    
    @agent
    def execution_monitor(self) -> Agent:
        
        return Agent(
            config=self.agents_config["execution_monitor"],
            
            
            tools=[				FileReadTool()],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            max_execution_time=None,
            llm=LLM(
                model="groq/llama-3.3-70b-versatile",
                temperature=0.7,
            ),
            
        )
    

    
    @task
    def initialize_orchestration_strategy(self) -> Task:
        return Task(
            config=self.tasks_config["initialize_orchestration_strategy"],
            markdown=False,
            
            
        )
    
    @task
    def dynamic_task_assignment(self) -> Task:
        return Task(
            config=self.tasks_config["dynamic_task_assignment"],
            markdown=False,
            
            
        )
    
    @task
    def intelligence_gathering_operations(self) -> Task:
        return Task(
            config=self.tasks_config["intelligence_gathering_operations"],
            markdown=False,
            
            
        )
    
    @task
    def real_time_data_processing_pipeline(self) -> Task:
        return Task(
            config=self.tasks_config["real_time_data_processing_pipeline"],
            markdown=False,
            
            
        )
    
    @task
    def continuous_execution_monitoring(self) -> Task:
        return Task(
            config=self.tasks_config["continuous_execution_monitoring"],
            markdown=False,
            
            
        )
    
    @task
    def quality_validation_and_output_certification(self) -> Task:
        return Task(
            config=self.tasks_config["quality_validation_and_output_certification"],
            markdown=False,
            
            
        )
    

    @crew
    def crew(self) -> Crew:
        """Creates the AiAgentOrchestrationHub crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            chat_llm=LLM(model="groq/llama-3.3-70b-versatile"),
        )


# Alias for CrewAI CLI compatibility
AiAgentOrchestrationHub = AiAgentOrchestrationHubCrew
