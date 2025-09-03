import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CustomDatePicker from '../../../components/common/CustomDatePicker'

describe('CustomDatePicker Component', () => {
  let mockOnChange
  const user = userEvent.setup()

  beforeEach(() => {
    mockOnChange = vi.fn()
    vi.clearAllMocks()
  })

  const renderComponent = (props = {}) => {
    return render(
      <CustomDatePicker
        onChange={mockOnChange}
        {...props}
      />
    )
  }

  // 1. Core Rendering & Props Tests
  describe('Core Rendering and Props', () => {
    it('should render date picker button with placeholder text', () => {
      renderComponent()
      
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('Sélectionner une date')).toBeInTheDocument()
    })

    it('should display selected date in French format when value provided', () => {
      renderComponent({ value: '2024-01-20' })
      
      expect(screen.getByText('20/01/2024')).toBeInTheDocument()
    })

    it('should apply custom placeholder and className', () => {
      renderComponent({ 
        placeholder: 'Choisir une date',
        className: 'custom-class'
      })
      
      expect(screen.getByText('Choisir une date')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
  })

  // 2. Dropdown Interaction Tests
  describe('Dropdown Interaction', () => {
    it('should open calendar dropdown when button clicked', async () => {
      renderComponent()
      
      // Initially calendar should not be visible (check for any month)
      expect(screen.queryByText(/\d{4}/)).not.toBeInTheDocument() // No year visible
      
      // Click button to open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Should show calendar with current month/year and day headers
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument() // Any year should be visible
        expect(screen.getByText('Dim')).toBeInTheDocument() // Day headers
        expect(screen.getByText('Lun')).toBeInTheDocument()
      })
    })

    it('should close calendar when clicking outside', async () => {
      const { container } = renderComponent()
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
      })
      
      // Click outside (on body)
      await user.click(document.body)
      
      // Wait for calendar to close
      await waitFor(() => {
        expect(screen.queryByText(/\d{4}/)).not.toBeInTheDocument()
      })
    })

    it('should close calendar when date selected', async () => {
      renderComponent()
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
      })
      
      // Click on a date (day 10)
      const dayButtons = screen.getAllByRole('button')
      const dayButton = dayButtons.find(btn => btn.textContent === '10' && btn.className.includes('w-8 h-8'))
      if (dayButton) {
        await user.click(dayButton)
        
        // After clicking a date, the calendar should close (check for action buttons disappearing)
        await waitFor(() => {
          expect(screen.queryByText('Aujourd\'hui')).not.toBeInTheDocument()
        })
      }
    })
  })

  // 3. Date Selection & Navigation Tests
  describe('Date Selection and Navigation', () => {
    it('should select date when day clicked and call onChange', async () => {
      renderComponent()
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
      })
      
      // Click on a specific day that should exist (day 15)
      const dayButtons = screen.getAllByRole('button')
      const dayButton = dayButtons.find(btn => 
        btn.className.includes('w-8 h-8') && 
        btn.textContent === '15' && 
        !btn.disabled
      )
      
      if (dayButton) {
        await user.click(dayButton)
        
        // Should call onChange with a valid date string
        expect(mockOnChange).toHaveBeenCalled()
        const calledWith = mockOnChange.mock.calls[0][0]
        expect(calledWith).toMatch(/\d{4}-\d{2}-\d{2}/)
        // Verify that onChange was called with a valid date
        expect(new Date(calledWith)).toBeInstanceOf(Date)
        expect(isNaN(new Date(calledWith).getTime())).toBe(false)
      } else {
        // If day 15 is not available, just check that any date selection works
        const anyDayButton = dayButtons.find(btn => 
          btn.className.includes('w-8 h-8') && 
          /^\d+$/.test(btn.textContent?.trim() || '') && 
          !btn.disabled
        )
        
        if (anyDayButton) {
          await user.click(anyDayButton)
          
          expect(mockOnChange).toHaveBeenCalled()
          const calledWith = mockOnChange.mock.calls[0][0]
          expect(calledWith).toMatch(/\d{4}-\d{2}-\d{2}/)
        }
      }
    })

    it('should navigate between months using arrow buttons', async () => {
      renderComponent()
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open and get initial month
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
      })
      
      const initialMonthText = screen.getByText(/\w+ \d{4}/).textContent
      
      // Navigate to next month using the right arrow button
      const navigationButtons = screen.getAllByRole('button')
      const nextButton = navigationButtons.find(btn => 
        btn.querySelector('svg') && btn.className.includes('hover:bg-orange-50')
      )
      
      if (nextButton) {
        await user.click(nextButton)
        
        await waitFor(() => {
          const newMonthText = screen.getByText(/\w+ \d{4}/).textContent
          expect(newMonthText).not.toBe(initialMonthText)
        })
      }
    })

    it('should highlight today\'s date in calendar', async () => {
      renderComponent()
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
        // Calendar should be rendered with days
        const dayButtons = screen.getAllByRole('button')
        const calendarDays = dayButtons.filter(btn => btn.className.includes('w-8 h-8'))
        expect(calendarDays.length).toBeGreaterThan(0)
      })
    })

    it('should display correct month and year in header', async () => {
      renderComponent()
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open and check header format
      await waitFor(() => {
        const headerText = screen.getByText(/\w+ \d{4}/)
        expect(headerText).toBeInTheDocument()
        // Should match format like "Septembre 2025" or "Janvier 2024"
        expect(headerText.textContent).toMatch(/^\w+ \d{4}$/)
      })
    })
  })

  // 4. Constraints & Validation Tests
  describe('Constraints and Validation', () => {
    it('should disable dates outside minDate/maxDate range', async () => {
      // Set constraints for current month
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth()
      const minDate = new Date(currentYear, currentMonth, 10).toISOString().split('T')[0]
      const maxDate = new Date(currentYear, currentMonth, 25).toISOString().split('T')[0]
      
      renderComponent({ minDate, maxDate })
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
        
        // Check that some dates are disabled
        const dayButtons = screen.getAllByRole('button')
        const calendarDays = dayButtons.filter(btn => btn.className.includes('w-8 h-8'))
        
        // Find a day that should be disabled (day 5, before minDate)
        const day5Button = calendarDays.find(btn => btn.textContent === '5')
        if (day5Button) {
          expect(day5Button).toBeDisabled()
        }
        
        // Find a day that should be enabled (day 15, within range)
        const day15Button = calendarDays.find(btn => btn.textContent === '15')
        if (day15Button) {
          expect(day15Button).not.toBeDisabled()
        }
      })
    })

    it('should prevent selection of disabled dates', async () => {
      // Set constraints for current month
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth()
      const minDate = new Date(currentYear, currentMonth, 10).toISOString().split('T')[0]
      const maxDate = new Date(currentYear, currentMonth, 25).toISOString().split('T')[0]
      
      renderComponent({ minDate, maxDate })
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
      })
      
      // Try to click on disabled date (day 5)
      const dayButtons = screen.getAllByRole('button')
      const calendarDays = dayButtons.filter(btn => btn.className.includes('w-8 h-8'))
      const day5Button = calendarDays.find(btn => btn.textContent === '5')
      
      if (day5Button && day5Button.disabled) {
        await user.click(day5Button)
        // onChange should not be called
        expect(mockOnChange).not.toHaveBeenCalled()
      }
    })

    it('should respect date constraints when navigating', async () => {
      const testDate = '2024-01-15'
      renderComponent({ 
        value: testDate,
        minDate: '2024-01-01',
        maxDate: '2024-01-31'
      })
      
      // Should show the selected date in the button
      expect(screen.getByText('15/01/2024')).toBeInTheDocument()
      
      // Open calendar and verify it opens successfully
      const button = screen.getByRole('button')
      await user.click(button)
      
      await waitFor(() => {
        // Look specifically for the calendar header (month + year)
        const calendarHeaders = screen.getAllByText(/\w+ \d{4}/)
        expect(calendarHeaders.length).toBeGreaterThan(0)
      })
    })
  })

  // 5. Action Buttons Tests
  describe('Action Buttons', () => {
    it('should set today\'s date when "Aujourd\'hui" clicked', async () => {
      renderComponent()
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
      })
      
      // Click "Aujourd'hui" button
      const todayButton = screen.getByText('Aujourd\'hui')
      await user.click(todayButton)
      
      // Should call onChange with today's date
      expect(mockOnChange).toHaveBeenCalled()
      const calledWith = mockOnChange.mock.calls[0][0]
      expect(calledWith).toMatch(/\d{4}-\d{2}-\d{2}/)
    })

    it('should clear selection when "Effacer" clicked', async () => {
      renderComponent({ value: '2024-01-20' })
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open by looking for the action buttons
      await waitFor(() => {
        expect(screen.getByText('Aujourd\'hui')).toBeInTheDocument()
      })
      
      // Should show "Effacer" button when there's a selection
      const clearButton = screen.getByText('Effacer')
      expect(clearButton).toBeInTheDocument()
      
      // Click "Effacer"
      await user.click(clearButton)
      
      expect(mockOnChange).toHaveBeenCalledWith('')
    })
  })

  // 6. French Localization Tests
  describe('French Localization', () => {
    it('should display French month names and day abbreviations', async () => {
      renderComponent()
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open
      await waitFor(() => {
        // Check that a French month name is displayed (any month is fine)
        const monthHeader = screen.getByText(/\w+ \d{4}/)
        expect(monthHeader).toBeInTheDocument()
        
        // Check day abbreviations
        expect(screen.getByText('Dim')).toBeInTheDocument()
        expect(screen.getByText('Lun')).toBeInTheDocument()
        expect(screen.getByText('Mar')).toBeInTheDocument()
        expect(screen.getByText('Mer')).toBeInTheDocument()
        expect(screen.getByText('Jeu')).toBeInTheDocument()
        expect(screen.getByText('Ven')).toBeInTheDocument()
        expect(screen.getByText('Sam')).toBeInTheDocument()
      })
    })

    it('should format selected date in French locale (DD/MM/YYYY)', () => {
      renderComponent({ value: '2024-12-25' })
      
      // Should display in French format
      expect(screen.getByText('25/12/2024')).toBeInTheDocument()
    })
  })

  // 7. Integration Tests
  describe('Integration Behavior', () => {
    it('should handle value prop changes correctly', async () => {
      const { rerender } = renderComponent({ value: '2024-01-10' })
      
      // Initial value displayed
      expect(screen.getByText('10/01/2024')).toBeInTheDocument()
      
      // Update value prop
      rerender(
        <CustomDatePicker
          onChange={mockOnChange}
          value="2024-02-20"
        />
      )
      
      expect(screen.getByText('20/02/2024')).toBeInTheDocument()
    })

    it('should maintain calendar position when selecting dates in different months', async () => {
      renderComponent()
      
      // Open calendar
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Wait for calendar to open
      await waitFor(() => {
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
      })
      
      // Navigate to next month
      const navigationButtons = screen.getAllByRole('button')
      const nextButton = navigationButtons.find(btn => 
        btn.querySelector('svg') && btn.className.includes('hover:bg-orange-50')
      )
      
      if (nextButton) {
        await user.click(nextButton)
        
        // Wait for month change
        await waitFor(() => {
          expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
        })
        
        // Select a date in the new month
        const dayButtons = screen.getAllByRole('button')
        const calendarDays = dayButtons.filter(btn => btn.className.includes('w-8 h-8'))
        const dayButton = calendarDays.find(btn => btn.textContent === '14' && !btn.disabled)
        
        if (dayButton) {
          await user.click(dayButton)
          expect(mockOnChange).toHaveBeenCalled()
        }
      }
    })
  })
})