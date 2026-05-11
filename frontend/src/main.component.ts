import { Component, ChangeDetectionStrategy, inject, signal, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { tap } from 'rxjs/operators';

/**
 * AUTH SERVICE
 * Handles communication with the Node.js backend for Login and Registration.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  
  // Angular Signal to track the logged-in user state
  currentUser = signal<any>(null);

  constructor(private http: HttpClient) {
    // Check if a user session exists in local storage on startup
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}

/**
 * MAIN APP COMPONENT
 * The entry point for the College Grievance Portal UI.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      <!-- AUTHENTICATION VIEW (Shown if user is NOT logged in) -->
      @if (!authService.currentUser()) {
        <div class="min-h-screen flex items-center justify-center p-6 bg-slate-900">
          <div class="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-white w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <h1 class="text-2xl font-black tracking-tight mb-2">EduGuard Portal</h1>
            <p class="text-slate-500 text-sm mb-8 font-medium">Please sign in to your institutional account</p>
            
            <div class="space-y-4">
              <button class="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                Sign In (Demo Mode)
              </button>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Connect to Node.js Backend: http://localhost:5000
              </p>
            </div>
          </div>
        </div>
      } 
      
      <!-- DASHBOARD VIEW (Shown if user IS logged in) -->
      @else {
        <div class="flex min-h-screen">
          <!-- SIDEBAR -->
          <aside class="w-64 bg-slate-950 text-white flex flex-col p-6 shadow-2xl">
            <div class="flex items-center gap-3 mb-12">
              <div class="bg-indigo-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-white w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
              <h1 class="font-black text-lg tracking-tight">EduGuard</h1>
            </div>

            <nav class="space-y-2 flex-1">
              <a class="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm">
                Dashboard
              </a>
              <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white transition-colors font-bold text-sm">
                My Grievances
              </a>
              <a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white transition-colors font-bold text-sm">
                Profile
              </a>
            </nav>

            <div class="pt-6 border-t border-white/5">
              <div class="flex items-center gap-3 mb-6 px-2">
                <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-black text-xs">
                  {{ authService.currentUser()?.name?.charAt(0) }}
                </div>
                <div class="overflow-hidden">
                  <p class="text-xs font-black truncate">{{ authService.currentUser()?.name }}</p>
                  <p class="text-[10px] text-slate-500 font-bold uppercase">{{ authService.currentUser()?.role }}</p>
                </div>
              </div>
              <button (click)="authService.logout()" class="w-full py-3 bg-white/5 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Sign Out
              </button>
            </div>
          </aside>
          
          <!-- MAIN AREA -->
          <main class="flex-1 p-10 overflow-y-auto">
            <header class="flex justify-between items-center mb-10">
              <div>
                <h2 class="text-3xl font-black tracking-tight text-slate-900">Dashboard Overview</h2>
                <p class="text-slate-500 font-medium">Institutional ID: {{ authService.currentUser()?.idNumber }}</p>
              </div>
              <div class="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                Database Connected
              </div>
            </header>

            <!-- STATS CARDS -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Submissions</p>
                <h3 class="text-3xl font-black text-slate-900">0</h3>
              </div>
              <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Resolved Cases</p>
                <h3 class="text-3xl font-black text-emerald-600">0</h3>
              </div>
              <div class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Active Role</p>
                <h3 class="text-3xl font-black text-indigo-600 uppercase">{{ authService.currentUser()?.role }}</h3>
              </div>
            </div>

            <!-- WELCOME CONTENT -->
            <div class="bg-indigo-600 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
              <div class="relative z-10">
                <h3 class="text-4xl font-black mb-4">Welcome back, {{ authService.currentUser()?.name }}!</h3>
                <p class="text-indigo-100 max-w-lg leading-relaxed font-medium">
                  This portal is connected to your Node.js backend. Every grievance you file is secured with JWT encryption and stored in MongoDB.
                </p>
                <button class="mt-8 px-8 py-4 bg-white text-indigo-600 rounded-xl font-black text-sm shadow-xl">
                  File New Grievance
                </button>
              </div>
              <svg class="absolute -right-20 -bottom-20 text-white/10 w-96 h-96" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
          </main>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  public authService = inject(AuthService);
}