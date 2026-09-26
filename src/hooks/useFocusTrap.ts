import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * Hook de accesibilidad (WCAG 2.1) para confinar la navegación por teclado (Tab / Shift+Tab)
 * dentro de un diálogo modal y restaurar el foco previo al cerrar.
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(isActive: boolean = true) {
  const containerRef = useRef<T | null>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    // Guardar el elemento enfocado antes de abrir el modal para restituir foco al salir
    if (document.activeElement instanceof HTMLElement) {
      previousActiveElement.current = document.activeElement
    }

    const container = containerRef.current
    if (!container) return

    // Enfocar el primer elemento interactivo disponible en el modal
    const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    } else {
      container.focus()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab') return
      const currentContainer = containerRef.current
      if (!currentContainer) return

      const elements = Array.from(currentContainer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null && !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
      )

      if (elements.length === 0) {
        event.preventDefault()
        return
      }

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]

      if (event.shiftKey) {
        // Shift + Tab: navegando hacia atrás
        if (document.activeElement === firstElement || !currentContainer.contains(document.activeElement)) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab normal: navegando hacia adelante
        if (document.activeElement === lastElement || !currentContainer.contains(document.activeElement)) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      // Restaurar el foco al elemento que activó el modal
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus()
      }
    }
  }, [isActive])

  return containerRef
}
