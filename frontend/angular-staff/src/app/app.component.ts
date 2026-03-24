import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="auth.isLoggedIn">
      <div class="navbar-inner">
        <a routerLink="/" class="navbar-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
          TechTrack Staff
        </a>
        <ul class="navbar-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">🏠 Dashboard</a></li>
          <li><a routerLink="/projects" routerLinkActive="active">📁 Projects</a></li>
          <li><a routerLink="/students" routerLinkActive="active">👥 Students</a></li>
          <li><a routerLink="/documents" routerLinkActive="active">📄 Documents</a></li>
          <li><a routerLink="/profile" routerLinkActive="active">👤 Profile</a></li>
          <li><a routerLink="/help" routerLinkActive="active">❓ Help</a></li>
          <li style="position:relative">
            <button class="notification-btn" (click)="toggleNotifs()">
              🔔
              <span class="notification-badge" *ngIf="unreadCount > 0">{{unreadCount > 9 ? '9+' : unreadCount}}</span>
            </button>
            <div class="notification-dropdown" *ngIf="showNotifs">
              <div class="notif-header">
                <h3>Notifications</h3>
                <button *ngIf="unreadCount > 0" (click)="markAllRead()">Mark all read</button>
              </div>
              <div *ngIf="notifications.length === 0" class="notif-empty">No notifications</div>
              <div *ngFor="let n of notifications.slice(0,20)" class="notif-item" [class.unread]="!n.read" (click)="markRead(n)">
                <h4>{{n.title}}</h4>
                <p>{{n.message}}</p>
                <span class="notif-time">{{timeAgo(n.createdAt)}}</span>
              </div>
            </div>
          </li>
          <li><button (click)="logout()" style="color:var(--accent-red)">🚪 Logout</button></li>
        </ul>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  notifications: any[] = [];
  unreadCount = 0;
  showNotifs = false;

  constructor(public auth: AuthService, private api: ApiService, private router: Router) {
    if (auth.isLoggedIn) this.loadNotifs();
    setInterval(() => { if (auth.isLoggedIn) this.loadNotifs(); }, 30000);
  }

  loadNotifs() {
    this.api.getNotifications().subscribe((res: any) => {
      this.notifications = res.data;
      this.unreadCount = res.unreadCount;
    });
  }

  toggleNotifs() { this.showNotifs = !this.showNotifs; }

  markRead(n: any) {
    if (!n.read) this.api.markRead(n._id).subscribe(() => this.loadNotifs());
  }

  markAllRead() {
    this.api.markAllRead().subscribe(() => this.loadNotifs());
  }

  timeAgo(date: string): string {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    return Math.floor(h / 24) + 'd ago';
  }

  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
