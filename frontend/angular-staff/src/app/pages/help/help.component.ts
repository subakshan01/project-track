import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>📘 Help & SRS Module</h1><p>Staff portal feature guide</p></div>
      <div style="padding:1.5rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);margin-bottom:2rem">
        <h3 style="margin-bottom:0.5rem">Software Requirements Specification</h3>
        <p style="color:var(--text-secondary);line-height:1.7">TechTrack Staff Portal is built with Angular 17 (standalone components). It connects to the same Express.js+MongoDB backend as the React Student Portal. Staff members can manage projects, review student requests, verify documents, and set their availability.</p>
      </div>
      <div *ngFor="let s of sections; let i = index" class="help-section">
        <div class="help-question" (click)="toggle(i)"><span>{{s.title}}</span><span>{{open === i ? '▲' : '▼'}}</span></div>
        <div *ngIf="open === i" class="help-answer"><p *ngFor="let line of s.content.split('\\n')" [style.margin-bottom]="line.trim() ? '4px' : '12px'">{{line}}</p></div>
      </div>
    </div>
  `
})
export class HelpComponent {
  open: number | null = null;
  toggle(i: number) { this.open = this.open === i ? null : i; }
  sections = [
    { title: '🔐 Staff Login', content: 'Login with your institutional email and password.\\nJWT tokens are valid for 7 days.\\nOnly staff-role accounts can access this portal.' },
    { title: '📁 Creating Projects', content: 'Go to Projects → Click "New Project".\\nFill in project details and add vacancies.\\nVacancy format: Role Name | Skill1, Skill2\\nOne vacancy per line.\\nAll students are notified when a new project is created.' },
    { title: '✅ Reviewing Role Requests', content: 'Open a project detail page to see pending requests.\\nReview the student profile, skills, and experience.\\nAdd a comment and click Approve or Reject.\\nApproved students are added to the team.\\nOther pending requests for the same vacancy are auto-rejected.' },
    { title: '📄 Document Verification', content: 'Go to Documents page to see pending uploads.\\nStudents upload resumes, certificates, and project proofs.\\nReview each document and verify or reject with a comment.\\nStudents receive notifications of your decision.' },
    { title: '🟢 Availability Status', content: 'Go to Profile page to set your status.\\nAvailable – Open to new projects.\\nBusy – Currently occupied.\\nNot Interested – Not taking projects.\\nStatus shows on your profile, staff directory, and project pages.' },
    { title: '💬 Discussion Threads', content: 'Each project has a built-in discussion board.\\nPost updates, questions, or comments.\\nBoth staff and students can participate.\\nNo external chat tools needed.' },
    { title: '📦 Project Archiving', content: 'When you set a project status to Completed, it auto-archives.\\nArchived projects show outcomes and team summary.\\nStudents can showcase archived projects in their profile.' },
    { title: '🔔 Notifications', content: 'Bell icon in the top navigation shows unread count.\\nNotifications include: new role requests, project updates.\\nClick on a notification to mark it read.\\nUse "Mark all read" to clear all.' }
  ];
}
