let isMobileMenuOpen = false;
const listeners = new Set<() => void>();
let snapshot = { isMobileMenuOpen };

function emit() {
  snapshot = { isMobileMenuOpen };
  listeners.forEach((listener) => listener());
}

export const uiStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return snapshot;
  },
  openMobileMenu() {
    isMobileMenuOpen = true;
    emit();
  },
  closeMobileMenu() {
    isMobileMenuOpen = false;
    emit();
  },
  toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    emit();
  },
};
