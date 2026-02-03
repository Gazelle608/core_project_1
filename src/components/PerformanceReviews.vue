<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-2">
        <div class="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
          <i class="bi bi-graph-up text-primary fs-3"></i>
        </div>
        <div>
          <h1 class="h2 mb-1 fw-bold" style="color: #2d3748;">Performance Reviews</h1>
          <p class="text-muted mb-0">Track and evaluate employee performance</p>
        </div>
      </div>
    </div>

    <!-- Performance Stats -->
    <div class="row g-4 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0">
          <div class="card-body text-center">
            <div class="text-primary mb-2">
              <i class="bi bi-trophy fs-1"></i>
            </div>
            <h3 class="fw-bold mb-1">{{ excellentCount }}</h3>
            <p class="text-muted small mb-0">Excellent</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0">
          <div class="card-body text-center">
            <div class="text-success mb-2">
              <i class="bi bi-check-circle fs-1"></i>
            </div>
            <h3 class="fw-bold mb-1">{{ goodCount }}</h3>
            <p class="text-muted small mb-0">Good</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0">
          <div class="card-body text-center">
            <div class="text-warning mb-2">
              <i class="bi bi-exclamation-circle fs-1"></i>
            </div>
            <h3 class="fw-bold mb-1">{{ averageCount }}</h3>
            <p class="text-muted small mb-0">Average</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0">
          <div class="card-body text-center">
            <div class="text-danger mb-2">
              <i class="bi bi-flag fs-1"></i>
            </div>
            <h3 class="fw-bold mb-1">{{ needsImprovementCount }}</h3>
            <p class="text-muted small mb-0">Needs Improvement</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Table -->
    <div class="card border-0 mb-4">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-clipboard-data me-2 text-primary"></i>
          Employee Performance
        </h5>
        <div class="d-flex gap-2">
          <select v-model="filterRating" class="form-select form-select-sm w-auto">
            <option value="">All Ratings</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Needs Improvement">Needs Improvement</option>
          </select>
          <select v-model="filterDept" class="form-select form-select-sm w-auto">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept">{{ dept }}</option>
          </select>
        </div>
      </div>
      
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Performance Score</th>
                <th>Rating</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="performance in filteredPerformance" :key="performance.employeeId">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-person text-primary"></i>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ performance.name }}</div>
                      <small class="text-muted">ID: {{ performance.employeeId }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" :style="{ backgroundColor: getDepartmentColor(performance.department), color: 'white' }">
                    {{ performance.department }}
                  </span>
                </td>
                <td class="fw-semibold">{{ performance.position }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="progress flex-grow-1 me-2" style="height: 8px;">
                      <div class="progress-bar" :class="getScoreClass(performance.performanceScore)" 
                           :style="{ width: performance.performanceScore + '%' }"></div>
                    </div>
                    <span class="fw-bold">{{ performance.performanceScore }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="getRatingClass(performance.rating)">
                    {{ performance.rating }}
                  </span>
                </td>
                <td>
                  <span class="fw-semibold">{{ performance.attendanceRate }}%</span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="View Details" @click.prevent="viewDetails(performance)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" title="Schedule Review" @click.prevent="scheduleReview(performance)">
                      <i class="bi bi-calendar-plus"></i>
                    </button>
                    <button class="btn btn-outline-info" title="Download Report" @click.prevent="downloadReport(performance)">
                      <i class="bi bi-download"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Performance Distribution -->
    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card border-0 h-100">
          <div class="card-header bg-white">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-pie-chart me-2 text-primary"></i>
              Performance Distribution
            </h5>
          </div>
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-6">
                <div class="d-flex flex-column align-items-center">
                  <div class="position-relative mb-3" style="width: 150px; height: 150px;">
                    <div class="position-absolute top-50 start-50 translate-middle">
                      <div class="h3 fw-bold mb-0">{{ avgScore }}</div>
                      <div class="small text-muted">Avg. Score</div>
                    </div>
                    <svg width="150" height="150" viewBox="0 0 150 150">
                      <!-- Background circle -->
                      <circle cx="75" cy="75" r="70" fill="none" stroke="#e2e8f0" stroke-width="10"/>
                      <!-- Score circle -->
                      <circle cx="75" cy="75" r="70" fill="none" stroke="linear-gradient(135deg, #667eea, #764ba2)" 
                              stroke-width="10" stroke-dasharray="440" 
                              :stroke-dashoffset="440 - (avgScore / 100 * 440)" 
                              stroke-linecap="round" transform="rotate(-90 75 75)"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex flex-column gap-2">
                  <div v-for="rating in ratingDistribution" :key="rating.name" class="d-flex align-items-center">
                    <div class="me-2" :style="{ width: '12px', height: '12px', backgroundColor: getRatingColor(rating.name), borderRadius: '2px' }"></div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between">
                        <span class="small">{{ rating.name }}</span>
                        <span class="small fw-semibold">{{ rating.count }} ({{ rating.percentage }}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card border-0 h-100">
          <div class="card-header bg-white">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-trend-up me-2 text-primary"></i>
              Top Performers
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-3">
              <div v-for="performer in topPerformers" :key="performer.employeeId" class="d-flex align-items-center">
                <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <span class="fw-bold text-primary">{{ performer.rank }}</span>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="fw-semibold">{{ performer.name }}</span>
                    <span class="badge" :class="getRatingClass(performer.rating)">
                      {{ performer.rating }}
                    </span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="small text-muted">{{ performer.department }} • {{ performer.position }}</span>
                    <span class="fw-bold">{{ performer.performanceScore }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores'

export default {
  name: 'PerformanceReviews',
  setup() {
    const store = useStore()

    const viewDetails = (performance) => {
      alert(`Employee: ${performance.name}\nScore: ${performance.performanceScore}\nRating: ${performance.rating}`)
    }

    const scheduleReview = (performance) => {
      const date = prompt('Enter review date (YYYY-MM-DD)')
      if (date) {
        store.scheduleReview({ employeeId: performance.employeeId, date })
        alert('Review scheduled')
      }
    }

    const downloadReport = (performance) => {
      const csv = `employeeId,name,score,rating\n${performance.employeeId},${performance.name},${performance.performanceScore},${performance.rating}`
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `performance_${performance.employeeId}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }

    return { store, viewDetails, scheduleReview, downloadReport }
  },
  data() {
    return {
      filterRating: '',
      filterDept: '',
      departmentColors: {
        'Development': '#3498db',
        'HR': '#9b59b6',
        'QA': '#2ecc71',
        'Sales': '#e74c3c',
        'Marketing': '#f39c12',
        'Design': '#1abc9c',
        'IT': '#34495e',
        'Finance': '#27ae60',
        'Support': '#95a5a6'
      }
    }
  },
  computed: {
    performanceData() {
      return this.store.state.employees.map(emp => {
        const perf = this.store.state.employees.find(e => e.employeeId === emp.employeeId) // fallback
        return ({
          employeeId: emp.employeeId,
          name: emp.name,
          department: emp.department,
          position: emp.position,
          performanceScore: Math.floor(Math.random() * 41) + 60, // static demo score
          rating: 'Average',
          attendanceRate: 85
        })
      })
    },
    departments() {
      return [...new Set(this.performanceData.map(p => p.department))]
    },
    excellentCount() {
      return this.performanceData.filter(p => p.rating === 'Excellent').length
    },
    goodCount() {
      return this.performanceData.filter(p => p.rating === 'Good').length
    },
    averageCount() {
      return this.performanceData.filter(p => p.rating === 'Average').length
    },
    needsImprovementCount() {
      return this.performanceData.filter(p => p.rating === 'Needs Improvement').length
    },
    avgScore() {
      const total = this.performanceData.reduce((sum, p) => sum + p.performanceScore, 0)
      return Math.round(total / Math.max(1, this.performanceData.length))
    },
    ratingDistribution() {
      const ratings = ['Excellent', 'Good', 'Average', 'Needs Improvement']
      return ratings.map(rating => {
        const count = this.performanceData.filter(p => p.rating === rating).length
        return {
          name: rating,
          count,
          percentage: Math.round((count / Math.max(1, this.performanceData.length)) * 100)
        }
      })
    },
    topPerformers() {
      return this.performanceData
        .sort((a, b) => b.performanceScore - a.performanceScore)
        .slice(0, 5)
        .map((p, index) => ({
          ...p,
          rank: index + 1
        }))
    },
    filteredPerformance() {
      let filtered = this.performanceData
      
      if (this.filterRating) {
        filtered = filtered.filter(p => p.rating === this.filterRating)
      }
      
      if (this.filterDept) {
        filtered = filtered.filter(p => p.department === this.filterDept)
      }
      
      return filtered
    }
  },
  methods: {
    getDepartmentColor(dept) {
      return this.departmentColors[dept] || '#7f8c8d'
    },
    getScoreClass(score) {
      if (score >= 90) return 'bg-success'
      if (score >= 80) return 'bg-primary'
      if (score >= 70) return 'bg-warning'
      return 'bg-danger'
    },
    getRatingClass(rating) {
      if (rating === 'Excellent') return 'bg-success bg-opacity-10 text-success'
      if (rating === 'Good') return 'bg-primary bg-opacity-10 text-primary'
      if (rating === 'Average') return 'bg-warning bg-opacity-10 text-warning'
      return 'bg-danger bg-opacity-10 text-danger'
    },
    getRatingColor(rating) {
      if (rating === 'Excellent') return '#198754'
      if (rating === 'Good') return '#667eea'
      if (rating === 'Average') return '#ffc107'
      return '#dc3545'
    }
  }
}
</script>

<style scoped>
.progress {
  background-color: #e2e8f0;
}

.badge {
  font-weight: 500;
  padding: 0.35rem 0.75rem;
}

circle {
  transition: stroke-dashoffset 1s ease;
}
</style>