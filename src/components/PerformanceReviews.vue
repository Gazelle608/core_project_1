<template>
  <div>
    <h2>Performance Reviews</h2>
    <p class="text-muted">Centralized performance review management</p>
    
    <!-- Simple Stats - Matching Employee Management Style -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-primary mb-2">
              <i class="bi bi-clipboard-data display-6"></i>
            </div>
            <h5 class="card-title text-muted">Total Reviews</h5>
            <h2 class="mb-0">{{ reviews.length }}</h2>
            <p class="card-text small mt-2 text-muted">Digital reviews</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-success mb-2">
              <i class="bi bi-graph-up display-6"></i>
            </div>
            <h5 class="card-title text-muted">Average Score</h5>
            <h2 class="mb-0">{{ avgScore }}%</h2>
            <p class="card-text small mt-2 text-muted">Overall performance</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-warning mb-2">
              <i class="bi bi-trophy display-6"></i>
            </div>
            <h5 class="card-title text-muted">Top Performer</h5>
            <h2 class="mb-0">{{ topPerformer }}</h2>
            <p class="card-text small mt-2 text-muted">Highest score</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Search Box -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input 
            type="text" 
            class="form-control" 
            v-model="searchQuery" 
            placeholder="Search reviews by employee name, department, or comments..."
          >
        </div>
        <div v-if="searchQuery" class="mt-2 text-muted small">
          Found {{ filteredReviews.length }} review{{ filteredReviews.length !== 1 ? 's' : '' }}
        </div>
      </div>
    </div>
    
    <!-- Submit New Review Card -->
    <div class="card mb-4">
      <div class="card-body text-center">
        <div class="text-info mb-3">
          <i class="bi bi-file-earmark-word display-4"></i>
        </div>
        <h5>Replace Word Files & Shared Drive</h5>
        <p class="text-muted mb-3">Submit reviews digitally instead of using Word files</p>
        <button class="btn btn-primary" @click="showForm = !showForm">
          <i class="bi bi-plus-lg"></i> Submit New Performance Review
        </button>
      </div>
    </div>
    
    <!-- Review Form (toggleable) -->
    <div v-if="showForm" class="card mb-4">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-clipboard-plus me-2"></i>
          <span>Submit New Performance Review</span>
        </div>
        <button class="btn btn-sm btn-outline-secondary" @click="showForm = false">
          <i class="bi bi-x-lg"></i> Cancel
        </button>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Employee</label>
            <select class="form-select" v-model="newReview.employeeId" @change="onEmployeeChange">
              <option value="">Select Employee</option>
              <option v-for="emp in employees" :key="emp.employeeId" :value="emp.employeeId">
                {{ emp.name }} ({{ emp.department }})
              </option>
            </select>
          </div>
          
          <div class="col-md-6 mb-3">
            <label class="form-label">Review Date</label>
            <input type="date" class="form-control" v-model="newReview.date">
          </div>
          
          <div class="col-md-4 mb-3">
            <label class="form-label">Department</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-building"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                v-model="newReview.department" 
                placeholder="Auto-filled"
                readonly
              >
            </div>
          </div>
          
          <div class="col-md-4 mb-3">
            <label class="form-label">Position</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-person-badge"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                v-model="newReview.position" 
                placeholder="Auto-filled"
                readonly
              >
            </div>
          </div>
          
          <div class="col-md-4 mb-3">
            <label class="form-label">Performance Score (1-100)</label>
            <div class="input-group">
              <input type="number" class="form-control" v-model="newReview.score" min="1" max="100">
              <span class="input-group-text">%</span>
            </div>
          </div>
          
          <div class="col-md-12 mb-3">
            <label class="form-label">Comments</label>
            <textarea class="form-control" v-model="newReview.comments" rows="3" placeholder="Enter overall performance assessment..."></textarea>
          </div>
          
          <div class="col-md-12">
            <div class="d-flex justify-content-end">
              <button class="btn btn-outline-secondary me-2" @click="resetForm">
                <i class="bi bi-arrow-clockwise"></i> Reset
              </button>
              <button class="btn btn-success" @click="submitReview">
                <i class="bi bi-check-lg"></i> Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Simple Performance Reviews Table -->
    <div class="card">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-clipboard-data me-2"></i>
          <span>Performance Reviews</span>
        </div>
        <span class="badge bg-primary">{{ filteredReviews.length }} reviews</span>
      </div>
      
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Employee</th>
                <th>Score</th>
                <th>Comments</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="review in filteredReviews" :key="review.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="employee-avatar me-3">
                      {{ getInitials(review.name) }}
                    </div>
                    <div>
                      <strong>{{ review.name }}</strong>
                      <div class="text-muted small">ID: {{ review.employeeId }}</div>
                      <div class="text-muted small">{{ review.position || review.role }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <span class="badge me-2" :class="getScoreClass(review.performanceScore)">
                      {{ review.performanceScore }}%
                    </span>
                    <div class="mini-progress" style="width: 60px;">
                      
                      <div class="progress" style="height: 6px;">
                        <div class="progress-bar" :class="getScoreClass(review.performanceScore)"
                             :style="{ width: review.performanceScore + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="small">
                    <div class="text-truncate" style="max-width: 200px;" :title="review.comments">
                      {{ truncateComments(review.comments) }}
                    </div>
                  </div>
                </td>
                <td>
                  <span class="text-muted small">
                    {{ formatDate(review.reviewDate) }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary"
                      @click="viewReview(review)"
                      title="View Details"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-outline-warning"
                      @click="editReview(review)"
                      title="Edit Review"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-outline-info"
                      @click="viewFullReview(review)"
                      title="View Full Review"
                    >
                      <i class="bi bi-file-text"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredReviews.length === 0" class="text-center py-5">
          <div class="mb-3">
            <i class="bi bi-clipboard-x display-1 text-muted"></i>
          </div>
          <h5>No performance reviews found</h5>
          <p class="text-muted">Submit your first review to get started</p>
        </div>
      </div>
    </div>
    
    <!-- Performance Summary -->
    <div class="card mt-4">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-graph-up me-2"></i>
          <span>Performance Summary</span>
        </div>
        <span class="badge bg-success">{{ avgScore }}% average</span>
      </div>
      <div class="card-body">
        <div v-if="reviews.length === 0" class="text-center py-3">
          <p class="text-muted">No performance data available</p>
        </div>
        <div v-else class="row">
          <div class="col-md-6">
            <h6 class="mb-3">Performance Distribution</h6>
            <div v-for="range in scoreRanges" :key="range.label" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small">{{ range.label }}</span>
                <span class="small">{{ range.count }} ({{ range.percentage }}%)</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div 
                  class="progress-bar" 
                  :style="{ 
                    width: range.percentage + '%',
                    backgroundColor: range.color
                  }"
                ></div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <h6 class="mb-3">Top Performers</h6>
            <div v-for="review in topPerformers.slice(0, 3)" :key="review.id" class="border rounded p-3 mb-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{{ review.name }}</strong>
                  <div class="text-muted small">{{ review.department }}</div>
                </div>
                <span class="badge" :class="getScoreClass(review.performanceScore)">
                  {{ review.performanceScore }}%
                </span>
              </div>
              <div class="mt-2 small text-truncate" :title="review.comments">
                {{ truncateComments(review.comments, 60) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerformanceReviews',
  inject: ['appState'],
  data() {
    return {
      searchQuery: '',
      showForm: false,
      newReview: {
        employeeId: '',
        score: 80,
        date: new Date().toISOString().split('T')[0],
        comments: '',
        department: '',
        position: ''
      },
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
    employees() {
      return this.appState.employees || []
    },
    reviews() {
      return this.appState.performanceData || []
    },
    filteredReviews() {
      if (!this.searchQuery) return this.reviews
      
      const query = this.searchQuery.toLowerCase()
      return this.reviews.filter(review => 
        review.name.toLowerCase().includes(query) ||
        review.department.toLowerCase().includes(query) ||
        (review.comments && review.comments.toLowerCase().includes(query)) ||
        (review.position && review.position.toLowerCase().includes(query))
      )
    },
    avgScore() {
      if (this.reviews.length === 0) return 0
      const total = this.reviews.reduce((sum, review) => sum + review.performanceScore, 0)
      return Math.round(total / this.reviews.length)
    },
    topPerformer() {
      if (this.reviews.length === 0) return 'None'
      const top = this.reviews.reduce((best, review) => 
        review.performanceScore > best.performanceScore ? review : best
      )
      return top.name.split(' ')[0]
    },
    scoreRanges() {
      const ranges = [
        { label: 'Excellent (80-100%)', min: 80, max: 100, color: '#198754' },
        { label: 'Good (60-79%)', min: 60, max: 79, color: '#ffc107' },
        { label: 'Needs Improvement (Below 60%)', min: 0, max: 59, color: '#dc3545' }
      ]
      
      return ranges.map(range => {
        const count = this.reviews.filter(r => 
          r.performanceScore >= range.min && r.performanceScore <= range.max
        ).length
        
        return {
          ...range,
          count,
          percentage: this.reviews.length > 0 ? Math.round((count / this.reviews.length) * 100) : 0
        }
      })
    },
    topPerformers() {
      return [...this.reviews].sort((a, b) => b.performanceScore - a.performanceScore)
    }
  },
  methods: {
    getInitials(name) {
      if (!name) return '??'
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
    getDepartmentColor(department) {
      return this.departmentColors[department] || '#7f8c8d'
    },
    getScoreClass(score) {
      if (score >= 80) return 'bg-success'
      if (score >= 60) return 'bg-warning'
      return 'bg-danger'
    },
    truncateComments(comments, length = 40) {
      if (!comments) return 'No comments'
      if (comments.length <= length) return comments
      return comments.substring(0, length) + '...'
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    onEmployeeChange() {
      if (this.newReview.employeeId) {
        const employee = this.getEmployeeById(parseInt(this.newReview.employeeId))
        if (employee) {
          this.newReview.department = employee.department
          this.newReview.position = employee.position
        }
      } else {
        this.newReview.department = ''
        this.newReview.position = ''
      }
    },
    getEmployeeById(id) {
      return this.employees.find(emp => emp.employeeId === id)
    },
    submitReview() {
      if (!this.newReview.employeeId) {
        alert('Please select an employee')
        return
      }
      
      const employee = this.getEmployeeById(parseInt(this.newReview.employeeId))
      if (!employee) {
        alert('Employee not found')
        return
      }
      
      // Create new review
      const newReview = {
        id: Date.now().toString(),
        name: employee.name,
        employeeId: parseInt(this.newReview.employeeId),
        department: this.newReview.department,
        position: this.newReview.position,
        role: employee.position,
        performanceScore: parseInt(this.newReview.score) || 80,
        comments: this.newReview.comments || 'No comments provided',
        reviewDate: this.newReview.date,
        submittedDate: new Date().toISOString().split('T')[0]
      }
      
      // Add to performance data
      if (!this.appState.performanceData) {
        this.appState.performanceData = []
      }
      
      this.appState.performanceData.push(newReview)
      
      // Reset form and hide it
      this.resetForm()
      this.showForm = false
      
      alert(`Performance review submitted for ${employee.name}!`)
    },
    resetForm() {
      this.newReview = {
        employeeId: '',
        score: 80,
        date: new Date().toISOString().split('T')[0],
        comments: '',
        department: '',
        position: ''
      }
    },
    viewReview(review) {
      const details = `
PERFORMANCE REVIEW
===================

Employee: ${review.name}
ID: ${review.employeeId}
Department: ${review.department}
Position: ${review.position || review.role || 'Not specified'}
Score: ${review.performanceScore}%

COMMENTS:
---------
${review.comments || 'No comments provided'}

Date: ${review.reviewDate || 'Not specified'}
      `
      
      alert(details)
    },
    editReview(review) {
      const newScore = prompt('Edit performance score (1-100):', review.performanceScore)
      if (newScore && !isNaN(newScore) && newScore >= 1 && newScore <= 100) {
        review.performanceScore = parseInt(newScore)
      }
      
      const newComments = prompt('Edit comments:', review.comments || '')
      if (newComments !== null) {
        review.comments = newComments
      }
      
      const newDate = prompt('Edit review date (YYYY-MM-DD):', review.reviewDate || '')
      if (newDate) {
        review.reviewDate = newDate
      }
      
      alert('Review updated')
    },
    viewFullReview(review) {
      if (!review.comments || review.comments.trim() === '') {
        alert(`${review.name} has no detailed comments.`)
        return
      }
      
      const fullReview = `
FULL PERFORMANCE REVIEW
========================

Employee: ${review.name}
Department: ${review.department}
Score: ${review.performanceScore}%
Date: ${review.reviewDate || 'Not specified'}

DETAILED ASSESSMENT:
====================
${review.comments}

==============================
This digital review replaces Word files that were previously stored in shared drive folders.
      `
      alert(fullReview)
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.08);
}

.card-header {
  background-color: white;
  border-bottom: 1px solid #eef2f7;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.employee-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.mini-progress {
  display: inline-block;
}

.progress-bar.bg-success {
  background-color: #198754 !important;
}

.progress-bar.bg-warning {
  background-color: #ffc107 !important;
}

.progress-bar.bg-danger {
  background-color: #dc3545 !important;
}

.badge.bg-success {
  background-color: #198754 !important;
}

.badge.bg-warning {
  background-color: #ffc107 !important;
  color: #000 !important;
}

.badge.bg-danger {
  background-color: #dc3545 !important;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Consistent with dashboard colors */
.text-primary { color: #0d6efd !important; }
.text-success { color: #198754 !important; }
.text-warning { color: #ffc107 !important; }
.text-info { color: #0dcaf0 !important; }
.text-danger { color: #dc3545 !important; }

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-success {
  background-color: #198754;
  border-color: #198754;
}

.badge.bg-primary {
  background-color: #0d6efd !important;
}

.badge.bg-info {
  background-color: #0dcaf0 !important;
}
</style>