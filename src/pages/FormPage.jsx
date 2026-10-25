import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Input from '../components/Input'

/**
 * MULTI-STEP FORM PAGE
 * 
 * Concepts covered:
 * - Controlled inputs: value + onChange = React owns the input
 * - Form validation: validate before advancing steps
 * - State persistence: data preserved when navigating between steps
 * - Conditional rendering: render different step UI based on currentStep
 * - Object state: updating nested form data correctly with spread operator
 */

// Validation rules — separated from component logic for cleanliness
const validate = (step, formData) => {
  const errors = {}

  if (step === 1) {
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      // Simple email regex validation
      errors.email = 'Enter a valid email address'
    }
  }

  if (step === 2) {
    if (!formData.phone.trim()) errors.phone = 'Phone is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.country.trim()) errors.country = 'Country is required'
  }

  return errors
}

// Initial form state — all fields live here (lifted up to parent)
const INITIAL_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  bio: '',
}

// Stepper component — receives currentStep as a prop (no own state)
function Stepper({ currentStep, totalSteps }) {
  return (
    <div className="stepper">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1
        const isDone = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <React.Fragment key={stepNum}>
            <div className={`step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
              <div className="step-circle">
                {isDone ? '✓' : stepNum}
              </div>
            </div>
            {/* Line between steps */}
            {stepNum < totalSteps && (
              <div className={`step-line ${isDone ? 'done' : ''}`} style={{ flex: 1 }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Step 1: Basic Info
function Step1({ formData, errors, onChange }) {
  return (
    <div className="form-step-content">
      <h3 className="font-display" style={{ marginBottom: 20, fontSize: 17 }}>
        Basic Information
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          error={errors.firstName}
          placeholder="John"
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          error={errors.lastName}
          placeholder="Doe"
        />
      </div>
      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        error={errors.email}
        placeholder="john@example.com"
      />
    </div>
  )
}

// Step 2: Contact Info
function Step2({ formData, errors, onChange }) {
  return (
    <div className="form-step-content">
      <h3 className="font-display" style={{ marginBottom: 20, fontSize: 17 }}>
        Contact Details
      </h3>
      <Input
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        error={errors.phone}
        placeholder="+1 234 567 8900"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="City"
          value={formData.city}
          onChange={(e) => onChange('city', e.target.value)}
          error={errors.city}
          placeholder="New York"
        />
        <Input
          label="Country"
          value={formData.country}
          onChange={(e) => onChange('country', e.target.value)}
          error={errors.country}
          placeholder="United States"
        />
      </div>
      <Input
        label="Bio (Optional)"
        value={formData.bio}
        onChange={(e) => onChange('bio', e.target.value)}
        placeholder="Tell us a little about yourself..."
      />
    </div>
  )
}

// Step 3: Review & Submit
function Step3({ formData }) {
  return (
    <div className="form-step-content">
      <h3 className="font-display" style={{ marginBottom: 20, fontSize: 17 }}>
        Review Your Information
      </h3>
      <div className="review-grid">
        {[
          { label: 'First Name', value: formData.firstName },
          { label: 'Last Name', value: formData.lastName },
          { label: 'Email', value: formData.email },
          { label: 'Phone', value: formData.phone },
          { label: 'City', value: formData.city },
          { label: 'Country', value: formData.country },
        ].map(({ label, value }) => (
          <div key={label} className="review-item">
            <label>{label}</label>
            <span>{value || '—'}</span>
          </div>
        ))}
      </div>
      {formData.bio && (
        <div className="review-item" style={{ marginTop: 0 }}>
          <label>Bio</label>
          <span style={{ fontSize: 13 }}>{formData.bio}</span>
        </div>
      )}
    </div>
  )
}

// Main Form Page
export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_DATA)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const TOTAL_STEPS = 3

  // Generic field update handler
  // Using a single handler for all fields avoids creating a handler per field
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error for this field as user types (good UX pattern)
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleNext = () => {
    // Validate current step before advancing
    const stepErrors = validate(currentStep, formData)

    if (Object.keys(stepErrors).length > 0) {
      // Show errors but don't advance
      setErrors(stepErrors)
      return
    }

    setErrors({}) // Clear errors on successful advance
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setErrors({})
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = () => {
    console.log('Form submitted!', formData)
    setSubmitted(true)
  }

  const handleReset = () => {
    setFormData(INITIAL_DATA)
    setCurrentStep(1)
    setErrors({})
    setSubmitted(false)
  }

  // Success screen after submission
  if (submitted) {
    return (
      <div className="page-container">
        <div className="card success-banner">
          <div className="success-icon">🎉</div>
          <h3>Form Submitted!</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Welcome, {formData.firstName}! Your details have been received.
          </p>
          <Button onClick={handleReset}>Start Over</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <PageHeader
        tag="module 02"
        title="Multi-Step Form"
        description="Controlled inputs with step-by-step validation. Form data persists as you navigate between steps."
        concepts={['controlled inputs', 'validation', 'conditional rendering', 'state persistence']}
      />

      <div className="card" style={{ maxWidth: 560 }}>
        {/* Stepper shows progress */}
        <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Current step label */}
        <div style={{ marginBottom: 24 }}>
          <span className="page-header-tag"># step {currentStep} of {TOTAL_STEPS}</span>
        </div>

        {/* Conditionally render the right step component */}
        {currentStep === 1 && (
          <Step1 formData={formData} errors={errors} onChange={handleChange} />
        )}
        {currentStep === 2 && (
          <Step2 formData={formData} errors={errors} onChange={handleChange} />
        )}
        {currentStep === 3 && (
          <Step3 formData={formData} />
        )}

        {/* Navigation buttons */}
        <div className="form-nav">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            ← Back
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={handleNext}>
              Next →
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              ✓ Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
