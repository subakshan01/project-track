import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="profile-header">
        <div class="profile-avatar">{{user?.name?.charAt(0)}}</div>
        <div class="profile-info">
          <h1>{{user?.name}}</h1>
          <p style="color:var(--text-secondary);font-size:1.05rem">{{user?.department}}</p>
          <div class="profile-meta">
            <span>📧 {{user?.email}}</span>
            <span *ngIf="user?.cabinNumber">📍 {{user?.cabinNumber}}, {{user?.floor}}</span>
            <span *ngIf="user?.yearsExperience">💼 {{user?.yearsExperience}} years</span>
            <span *ngIf="user?.contactNumber">📞 {{user?.contactNumber}}</span>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <h2>Availability Status</h2>
        <div style="display:flex;gap:12px">
          <button class="btn btn-sm" *ngFor="let a of ['Available','Busy','Not Interested']"
            [ngClass]="{'btn-primary': user?.availability === a, 'btn-secondary': user?.availability !== a}"
            (click)="setAvailability(a)">
            {{a === 'Available' ? '🟢' : a === 'Busy' ? '🟡' : '🔴'}} {{a}}
          </button>
        </div>
      </div>

      <div class="profile-section">
        <h2>🕐 Communication Time Slots</h2>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:12px">Set when students can reach you</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          <span *ngFor="let slot of timeSlots; let i = index" class="skill-tag"
            style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;font-size:0.9rem">
            {{slot}}
            <button (click)="removeSlot(i)" style="background:none;border:none;color:var(--accent-red);cursor:pointer;padding:0;font-size:1rem;line-height:1">&times;</button>
          </span>
          <span *ngIf="timeSlots.length === 0" style="color:var(--text-muted);font-size:0.9rem">No time slots set</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="form-input" [(ngModel)]="newSlot" placeholder="e.g. 10:00-11:00" style="max-width:200px;padding:6px 12px;font-size:0.9rem"
            (keyup.enter)="addSlot()">
          <button class="btn btn-primary btn-sm" (click)="addSlot()" [disabled]="!newSlot.trim()">+ Add</button>
        </div>
      </div>

      <div class="profile-section">
        <h2>Edit Profile</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group"><label>Name</label><input class="form-input" [(ngModel)]="form.name"></div>
          <div class="form-group"><label>Department</label>
            <select class="form-select" [(ngModel)]="form.department">
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
          <div class="form-group"><label>Cabin Number</label><input class="form-input" [(ngModel)]="form.cabinNumber"></div>
          <div class="form-group"><label>Floor</label><input class="form-input" [(ngModel)]="form.floor"></div>
          <div class="form-group"><label>Years Experience</label><input class="form-input" type="number" [(ngModel)]="form.yearsExperience"></div>
          <div class="form-group"><label>Contact Number</label><input class="form-input" [(ngModel)]="form.contactNumber"></div>
          <div class="form-group" style="grid-column:1/-1"><label>LinkedIn URL</label><input class="form-input" [(ngModel)]="form.linkedIn"></div>
          <div class="form-group" style="grid-column:1/-1"><label>Bio</label><textarea class="form-textarea" [(ngModel)]="form.bio"></textarea></div>
        </div>
        <button class="btn btn-primary" (click)="saveProfile()">💾 Save Changes</button>
        <span *ngIf="saved" style="color:var(--accent-green);margin-left:12px">✓ Saved!</span>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any;
  form: any = {};
  saved = false;
  timeSlots: string[] = [];
  newSlot = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getMe().subscribe((r: any) => {
      this.user = r.user;
      this.form = { ...r.user };
      this.timeSlots = r.user.timeSlots || [];
    });
  }

  setAvailability(a: string) {
    this.auth.updateAvailability(a, this.timeSlots).subscribe((r: any) => { this.user.availability = a; });
  }

  addSlot() {
    if (!this.newSlot.trim()) return;
    this.timeSlots.push(this.newSlot.trim());
    this.newSlot = '';
    this.auth.updateAvailability(this.user.availability || 'Available', this.timeSlots).subscribe();
  }

  removeSlot(index: number) {
    this.timeSlots.splice(index, 1);
    this.auth.updateAvailability(this.user.availability || 'Available', this.timeSlots).subscribe();
  }

  saveProfile() {
    this.auth.updateProfile(this.form).subscribe((r: any) => {
      this.user = r.data;
      this.saved = true;
      setTimeout(() => this.saved = false, 3000);
    });
  }
}
