<template>
  <div class="performance-container">
    <!-- Header -->
    <div class="page-header mb-4">
      <div class="d-flex align-items-center">
        <div class="header-icon me-3">
          <i class="bi bi-graph-up"></i>
        </div>
        <div>
          <h1>Performance Reviews</h1>
          <p class="page-subtitle">Centralized performance review management</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="exportReviews">
          <i class="bi bi-download me-2"></i>
          Export Reports
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-row mb-5">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="stat-card reviews-card">
            <div class="stat-icon">
              <i class="bi bi-clipboard-data"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ reviews.length }}</div>
              <div class="stat-label">Total Reviews</div>
              <div class="stat-trend">
                <i class="bi bi-arrow-up-right trend-up"></i>
                <span class="trend-text">+12 this quarter</span>
              </div>
            </div>
            <div class="stat-badge">
              <span class="badge">Digital reviews</span>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="stat-card score-card">
            <div class="stat-icon">
              <i class="bi bi-graph-up"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ avgScore }}%</div>
              <div class="stat-label">Average Score</div>
              <div class="stat-trend">
                <i class="bi bi-arrow-up-right trend-up"></i>
                <span class="trend-text">+5% from last year</span>
              </div>
            </div>
            <div class="stat-badge">
              <span class="badge">Overall performance</span>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="stat-card top-card">
            <div class="stat-icon">
              <i class="bi bi-trophy"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ topPerformer }}</div>
              <div class="stat-label">Top Performer</div>
              <div class="stat-detail">
                <span class="top-score">{{ getTopScore }}% score</span>
                <span class="top-dept">{{ getTopDept }}</span>
              </div>
            </div>
            <div class="stat-badge">
              <span class="badge">Highest score</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Box -->
    <div class="search-card mb-4">
      <div class="search-container">
        <div class="search-icon">
          <i class="bi bi-search"></i>
        </div>
        <input 
          type="text" 
          class="search-input" 
          v-model="searchQuery" 
          placeholder="Search reviews by employee name, department, or comments..."
          @input="onSearch"
        >
        <div v-if="searchQuery" class="search-results">
          <span class="results-count">
            Found {{ filteredReviews.length }} review{{ filteredReviews.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Action Card -->
    <div v-if="!showForm" class="action-card mb-5">
      <div class="action-content">
        <div class="action-icon">
          <i class="bi bi-file-earmark-word"></i>
        </div>
        <div class="action-text">
          <h3>Replace Word Files & Shared Drive</h3>
          <p>Submit reviews digitally instead of using Word files</p>
        </div>
        <button class="action-btn" @click="showForm = true">
          <i class="bi bi-plus-lg me-2"></i>
          Submit New Review
        </button>
      </div>
    </div>

    <!-- Review Form -->
    <div v-if="showForm" class="form-card mb-5">
      <div class="form-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-clipboard-plus me-3"></i>
          <h3>Submit New Performance Review</h3>
        </div>
        <button class="close-btn" @click="showForm = false">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="form-body">
        <div class="row">
          <div class="col-md-6 mb-4">
            <label class="form-label">Employee</label>
            <div class="form-group">
              <i class="bi bi-person form-icon"></i>
              <select class="form-control modern-select" v-model="newReview.employeeId" @change="onEmployeeChange">
                <option value="">Select Employee</option>
                <option v-for="emp in employees" :key="emp.employeeId" :value="emp.employeeId">
                  {{ emp.name }} ({{ emp.department }})
                </option>
              </select>
            </div>
          </div>
          
          <div class="col-md-6 mb-4">
            <label class="form-label">Review Date</label>
            <div class="form-group">
              <i class="bi bi-calendar form-icon"></i>
              <input type="date" class="form-control modern-input" v-model="newReview.date">
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <label class="form-label">Department</label>
            <div class="form-group">
              <i class="bi bi-building form-icon"></i>
              <input 
                type="text" 
                class="form-control modern-input" 
                v-model="newReview.department" 
                placeholder="Auto-filled"
                readonly
              >
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <label class="form-label">Position</label>
            <div class="form-group">
              <i class="bi bi-person-badge form-icon"></i>
              <input 
                type="text" 
                class="form-control modern-input" 
                v-model="newReview.position" 
                placeholder="Auto-filled"
                readonly
              >
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <label class="form-label">Performance Score</label>
            <div class="score-input-group">
              <div class="score-slider-container">
                <input 
                  type="range" 
                  class="score-slider" 
                  v-model="newReview.score" 
                  min="1" 
                  max="100"
                  @input="updateScoreDisplay"
                >
                <div class="score-labels">
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
              <div class="score-display" :class="getScoreClass(newReview.score)">
                {{ newReview.score }}%
              </div>
            </div>
          </div>
          
          <div class="col-12 mb-4">
            <label class="form-label">Comments</label>
            <div class="form-group">
              <textarea 
                class="form-control modern-textarea" 
                v-model="newReview.comments" 
                rows="4" 
                placeholder="Enter overall performance assessment..."
              ></textarea>
            </div>
          </div>
          
          <div class="col-12">
            <div class="form-actions">
              <button class="reset-btn" @click="resetForm">
                <i class="bi bi-arrow-clockwise me-2"></i>
                Reset Form
              </button>
              <button class="submit-btn" @click="submitReview">
                <i class="bi bi-check-lg me-2"></i>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Table -->
    <div class="main-card mb-5">
      <div class="card-header modern-card-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-clipboard-data me-3"></i>
          <h3>Performance Reviews</h3>
        </div>
        <div class="header-stats">
          <span class="total-badge">{{ filteredReviews.length }} reviews</span>
        </div>
      </div>
      
      <div class="card-body">
        <div v-if="filteredReviews.length > 0" class="table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Score</th>
                <th>Comments</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="review in filteredReviews" :key="review.id" @click="viewReview(review)">
                <td>
                  <div class="employee-cell">
                    <div class="employee-avatar" :style="{ background: getEmployeeGradient(review.employeeId) }">
                      {{ getInitials(review.name) }}
                    </div>
                    <div class="employee-info">
                      <div class="employee-name">{{ review.name }}</div>
                      <div class="employee-details">
                        <span class="employee-id">ID: {{ review.employeeId }}</span>
                        <span class="employee-dept">{{ review.department }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="score-cell">
                    <span class="score-badge" :class="getScoreClass(review.performanceScore)">
                      {{ review.performanceScore }}%
                    </span>
                    <div class="score-progress">
                      <div 
                        class="progress-fill"
                        :style="{ width: review.performanceScore + '%' }"
                        :class="getScoreClass(review.performanceScore)"
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="comments-cell">
                    <div class="comments-text">
                      {{ truncateComments(review.comments) }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="date-cell">
                    <div class="date-main">{{ formatDate(review.reviewDate) }}</div>
                  </div>
                </td>
                <td @click.stop>
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewReview(review)" title="View Details">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn edit" @click="editReview(review)" title="Edit Review">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn full" @click="viewFullReview(review)" title="View Full Review">
                      <i class="bi bi-file-text"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <i class="bi bi-clipboard-x"></i>
          </div>
          <h4>No performance reviews found</h4>
          <p>Submit your first review to get started</p>
          <button class="empty-action-btn" @click="showForm = true">
            <i class="bi bi-plus-circle me-2"></i>
            Create First Review
          </button>
        </div>
      </div>
    </div>

    <!-- Performance Summary -->
    <div class="summary-card">
      <div class="card-header modern-card-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-graph-up me-3"></i>
          <h3>Performance Summary</h3>
        </div>
        <div class="header-stats">
          <span class="average-badge">{{ avgScore }}% average</span>
        </div>
      </div>
      <div class="card-body">
        <div v-if="reviews.length === 0" class="empty-summary">
          <i class="bi bi-graph-up-arrow"></i>
          <p>No performance data available</p>
        </div>
        <div v-else class="row">
          <div class="col-lg-6 mb-4">
            <div class="distribution-chart">
              <h4>Performance Distribution</h4>
              <div v-for="range in scoreRanges" :key="range.label" class="distribution-item">
                <div class="distribution-header">
                  <div class="distribution-label">
                    <span class="range-color" :style="{ background: range.color }"></span>
                    <span>{{ range.label }}</span>
                  </div>
                  <div class="distribution-stats">
                    <span class="distribution-count">{{ range.count }} reviews</span>
                    <span class="distribution-percentage">{{ range.percentage }}%</span>
                  </div>
                </div>
                <div class="distribution-track">
                  <div 
                    class="distribution-fill"
                    :style="{ 
                      width: range.percentage + '%',
                      backgroundColor: range.color
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-6 mb-4">
            <div class="top-performers">
              <h4>Top Performers</h4>
              <div v-for="review in topPerformers.slice(0, 3)" :key="review.id" class="performer-card">
                <div class="performer-header">
                  <div class="performer-avatar" :style="{ background: getEmployeeGradient(review.employeeId) }">
                    {{ getInitials(review.name) }}
                  </div>
                  <div class="performer-info">
                    <div class="performer-name">{{ review.name }}</div>
                    <div class="performer-dept">{{ review.department }}</div>
                  </div>
                  <div class="performer-score" :class="getScoreClass(review.performanceScore)">
                    {{ review.performanceScore }}%
                  </div>
                </div>
                <div class="performer-comments">
                  <div class="comments-preview">
                    {{ truncateComments(review.comments, 80) }}
                  </div>
                </div>
                <div class="performer-meta">
                  <span class="meta-item">
                    <i class="bi bi-calendar me-1"></i>
                    {{ formatDate(review.reviewDate) }}
                  </span>
                  <button class="meta-action" @click="viewReview(review)">
                    View Details <i class="bi bi-arrow-right"></i>
                  </button>
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
      avatarColors: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      ]
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
    getTopScore() {
      if (this.reviews.length === 0) return 0
      const top = this.reviews.reduce((best, review) => 
        review.performanceScore > best.performanceScore ? review : best
      )
      return top.performanceScore
    },
    getTopDept() {
      if (this.reviews.length === 0) return ''
      const top = this.reviews.reduce((best, review) => 
        review.performanceScore > best.performanceScore ? review : best
      )
      return top.department
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
    getEmployeeGradient(employeeId) {
      const index = employeeId % this.avatarColors.length
      return this.avatarColors[index]
    },
    getScoreClass(score) {
      if (score >= 80) return 'excellent'
      if (score >= 60) return 'good'
      return 'needs-improvement'
    },
    truncateComments(comments, length = 50) {
      if (!comments || comments.trim() === '') return 'No comments provided'
      if (comments.length <= length) return comments
      return comments.substring(0, length) + '...'
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      const now = new Date()
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      
      return date.toLocaleDateString('en-US', {
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
    updateScoreDisplay() {
      // Animation effect for score change
      const scoreDisplay = document.querySelector('.score-display')
      if (scoreDisplay) {
        scoreDisplay.style.transform = 'scale(1.1)'
        setTimeout(() => {
          scoreDisplay.style.transform = 'scale(1)'
        }, 200)
      }
    },
    submitReview() {
      if (!this.newReview.employeeId) {
        this.showNotification('Please select an employee', 'warning')
        return
      }
      
      const employee = this.getEmployeeById(parseInt(this.newReview.employeeId))
      if (!employee) {
        this.showNotification('Employee not found', 'error')
        return
      }
      
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
      
      if (!this.appState.performanceData) {
        this.appState.performanceData = []
      }
      
      this.appState.performanceData.unshift(newReview)
      
      this.resetForm()
      this.showForm = false
      
      this.showNotification(`Performance review submitted for ${employee.name}!`, 'success')
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
      
      this.showNotification('Review updated successfully', 'success')
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
    },
    exportReviews() {
      this.showNotification('Exporting performance reviews...', 'info')
      // In a real app, this would trigger a download
      setTimeout(() => {
        this.showNotification('Reports exported successfully!', 'success')
      }, 1000)
    },
    onSearch() {
      // Search animation
      if (this.searchQuery) {
        const rows = document.querySelectorAll('.modern-table tbody tr')
        rows.forEach(row => {
          row.classList.remove('search-highlight')
          void row.offsetWidth // Trigger reflow
          row.classList.add('search-highlight')
        })
      }
    },
    showNotification(message, type = 'info') {
      const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      }[type]
      
      alert(icon + ' ' + message)
    }
  }
}
</script>

<style scoped>
.performance-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  min-height: 100vh;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-subtitle {
  color: #718096;
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Stats Cards */
.stats-row {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  height: 100%;
  border-left: 4px solid;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card.reviews-card {
  border-color: #667eea;
}

.stat-card.score-card {
  border-color: #764ba2;
}

.stat-card.top-card {
  border-color: #ffc107;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  font-size: 1.8rem;
}

.stat-card.reviews-card .stat-icon {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.stat-card.score-card .stat-icon {
  background: rgba(118, 75, 162, 0.1);
  color: #764ba2;
}

.stat-card.top-card .stat-icon {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trend-up {
  color: #198754;
}

.trend-down {
  color: #dc3545;
}

.trend-text {
  font-size: 0.8rem;
  color: #a0aec0;
}

.stat-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.top-score {
  color: #ffc107;
  font-weight: 500;
  font-size: 0.9rem;
}

.top-dept {
  font-size: 0.8rem;
  color: #718096;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  max-width: fit-content;
}

.stat-badge {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

.stat-badge .badge {
  background: rgba(0, 0, 0, 0.05);
  color: #718096;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
}

/* Search Box */
.search-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #667eea;
  font-size: 1.1rem;
  z-index: 1;
}

.search-input {
  flex: 1;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-results {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
}

.results-count {
  font-size: 0.875rem;
  color: #718096;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
}

/* Action Card */
.action-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  margin-bottom: 2rem;
}

.action-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.action-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.action-text h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: white;
}

.action-text p {
  margin: 0;
  opacity: 0.9;
}

.action-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  color: #764ba2;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.form-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  transform: rotate(90deg);
}

.form-body {
  padding: 2rem;
}

/* Form Styling */
.form-label {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: block;
}

.form-group {
  position: relative;
}

.form-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  z-index: 1;
}

.modern-select,
.modern-input,
.modern-textarea {
  padding-left: 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
  width: 100%;
}

.modern-select,
.modern-input {
  height: 48px;
}

.modern-textarea {
  padding: 1rem;
  min-height: 120px;
  resize: vertical;
}

.modern-select:focus,
.modern-input:focus,
.modern-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

/* Score Input */
.score-input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.score-slider-container {
  position: relative;
  padding-top: 1.5rem;
}

.score-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.score-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.score-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #718096;
}

.score-display {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.score-display.excellent {
  background: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.score-display.good {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.score-display.needs-improvement {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #eef2f7;
}

.reset-btn {
  background: white;
  border: 2px solid #e2e8f0;
  color: #718096;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Main Table Card */
.main-card,
.summary-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.modern-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
}

.modern-card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
}

.header-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.total-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
}

.average-badge {
  background: linear-gradient(135deg, #198754 0%, #2ecc71 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Modern Table */
.table-container {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table thead {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.modern-table th {
  padding: 1.25rem 1rem;
  font-weight: 600;
  color: #2d3748;
  text-align: left;
  border-bottom: 2px solid #eef2f7;
  white-space: nowrap;
}

.modern-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f7fafc;
  cursor: pointer;
}

.modern-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.02);
  transform: translateX(4px);
}

.modern-table tbody tr.search-highlight {
  animation: highlight 1s ease;
  background: rgba(255, 193, 7, 0.1);
}

@keyframes highlight {
  0% { background: rgba(255, 193, 7, 0.3); }
  100% { background: rgba(255, 193, 7, 0.1); }
}

.modern-table td {
  padding: 1.25rem 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #f7fafc;
}

/* Employee Cell */
.employee-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.employee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.employee-name {
  font-weight: 600;
  color: #2d3748;
}

.employee-details {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.employee-id {
  font-size: 0.75rem;
  color: #718096;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.employee-dept {
  font-size: 0.75rem;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

/* Score Cell */
.score-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.score-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
  width: fit-content;
}

.score-badge.excellent {
  background: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.score-badge.good {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.score-badge.needs-improvement {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.score-progress {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease-in-out;
}

.progress-fill.excellent {
  background: linear-gradient(90deg, #198754, #2ecc71);
}

.progress-fill.good {
  background: linear-gradient(90deg, #ffc107, #ffd54f);
}

.progress-fill.needs-improvement {
  background: linear-gradient(90deg, #dc3545, #e74c3c);
}

/* Comments Cell */
.comments-cell {
  max-width: 200px;
}

.comments-text {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.4;
}

/* Date Cell */
.date-cell {
  min-width: 100px;
}

.date-main {
  font-weight: 500;
  color: #2d3748;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-btn.view {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.action-btn.view:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.action-btn.edit {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.action-btn.edit:hover {
  background: #ffc107;
  color: white;
  transform: translateY(-2px);
}

.action-btn.full {
  background: rgba(32, 201, 151, 0.1);
  color: #20c997;
}

.action-btn.full:hover {
  background: #20c997;
  color: white;
  transform: translateY(-2px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.empty-state h4 {
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
  margin-bottom: 2rem;
}

.empty-action-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Performance Summary */
.empty-summary {
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;
}

.empty-summary i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #cbd5e0;
}

/* Distribution Chart */
.distribution-chart {
  padding: 1rem 0;
}

.distribution-chart h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.distribution-item {
  margin-bottom: 1.5rem;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.distribution-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.range-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.distribution-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
}

.distribution-count {
  color: #718096;
}

.distribution-percentage {
  font-weight: 600;
  color: #2d3748;
  min-width: 3rem;
  text-align: right;
}

.distribution-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-in-out;
}

/* Top Performers */
.top-performers {
  padding: 1rem 0;
}

.top-performers h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.performer-card {
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.performer-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.performer-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.performer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.performer-info {
  flex: 1;
}

.performer-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.performer-dept {
  font-size: 0.8rem;
  color: #718096;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.performer-score {
  font-size: 1.25rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.performer-score.excellent {
  background: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.performer-score.good {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.performer-score.needs-improvement {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.performer-comments {
  margin-bottom: 1rem;
}

.comments-preview {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.4;
  padding-left: 1rem;
  border-left: 3px solid #667eea;
}

.performer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.meta-item {
  font-size: 0.75rem;
  color: #718096;
  display: flex;
  align-items: center;
}

.meta-action {
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.meta-action:hover {
  color: #764ba2;
}

/* Responsive Design */
@media (max-width: 768px) {
  .performance-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .primary-btn {
    width: 100%;
    justify-content: center;
  }
  
  .action-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .stat-badge {
    position: static;
    margin-top: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .reset-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
  
  .modern-table {
    min-width: 800px;
  }
  
  .distribution-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .distribution-stats {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .performer-header {
    flex-direction: column;
    text-align: center;
  }
  
  .performer-info {
    text-align: center;
  }
}
</style>