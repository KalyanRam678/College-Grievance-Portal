import { Component, OnInit } from '@angular/core';
import { GrievanceService } from '../services/grievance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track.component.html'
})
export class TrackComponent implements OnInit {

  grouped: { [key: string]: any[] } = {};
  user: any;

  selectedCategory: string = "All";
  categories: string[] = [];
  originalData: any[] = [];

  constructor(
    private g: GrievanceService,
    private location: Location
  ) {}

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");

    this.g.getAll().subscribe({
      next: (res: any) => {
        const data = (res || []).sort((a: any, b: any) =>
          b._id.toString().localeCompare(a._id.toString())
        );

        this.originalData = data;

        const uniqueCategories = new Set<string>();
        data.forEach((item: any) => {
          uniqueCategories.add(String(item.category || "Other"));
        });

        this.categories = ["All", ...Array.from(uniqueCategories)];
        this.grouped = this.groupByCategory(data);
      },
      error: (err: any) => {
        console.log(err);
        alert("Failed to load complaints");
      }
    });
  }

  groupByCategory(data: any[]): { [key: string]: any[] } {
    const result: { [key: string]: any[] } = {};

    data.forEach((item: any) => {
      const category = item.category || "Other";

      if (!result[category]) {
        result[category] = [];
      }

      result[category].push(item);
    });

    return result;
  }

  update(id: any, status: any) {
    this.g.updateStatus({ id, status }).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err: any) => {
        console.log(err);
        alert("Status update failed");
      }
    });
  }

  filterCategory() {
    let filtered = this.originalData;

    if (this.selectedCategory !== "All") {
      filtered = this.originalData.filter((g: any) =>
        g.category === this.selectedCategory
      );
    }

    this.grouped = this.groupByCategory(filtered);
  }

  getStatusClass(status: any) {
    if (status === "Pending") return "pending";
    if (status === "In Progress") return "progress";
    if (status === "Resolved") return "resolved";
    if (status === "Rejected") return "rejected";
    return "";
  }
}