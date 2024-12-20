// Initialize syntax highlighting and playground
document.addEventListener('DOMContentLoaded', () => {
    hljs.highlightAll();
    initializePlayground();
    initializeMobileMenu();
});

function initializePlayground() {
    const codeInput = document.querySelector('.code-input');
    const codeDisplay = document.querySelector('.editor-pre code');
    const runButton = document.querySelector('.run-button');
    const resetButton = document.querySelector('.reset-button');
    const output = document.querySelector('.output');

    if (!codeInput || !codeDisplay) return;

    const defaultCode = codeInput.value;

    // Initialize output area
    if (output) {
        output.innerHTML = ''; // Clear any existing content
    }

    function updateCode() {
        const code = codeInput.value;
        codeDisplay.textContent = code;
        hljs.highlightElement(codeDisplay);
    }

    // Handle input and updates
    codeInput.addEventListener('input', updateCode);
    codeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = codeInput.selectionStart;
            const end = codeInput.selectionEnd;
            codeInput.value = codeInput.value.substring(0, start) + '    ' + codeInput.value.substring(end);
            codeInput.selectionStart = codeInput.selectionEnd = start + 4;
            updateCode();
        }
    });

    // Run button functionality
    runButton.addEventListener('click', async () => {
        runButton.disabled = true;
        runButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        output.innerHTML = '<div class="output-loading">Running code...</div>';
        
        try {
            // Simulate code execution (in a real app, this would send code to a backend)
            await new Promise(resolve => setTimeout(resolve, 1000));
            const code = codeInput.value;
            let result = '';
            
            // Simple simulation of code execution
            try {
                // Create a context for variables
                const context = {};
                
                // Split the code into lines and process each line
                const lines = code.split('\n');
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('print(')) {
                        // Extract content between parentheses
                        const match = line.match(/print\((.*)\)/);
                        if (match) {
                            let content = match[1];
                            // Handle f-strings (basic simulation)
                            if (content.startsWith('f"') || content.startsWith("f'")) {
                                content = content.slice(2, -1).replace(/{([^}]+)}/g, (_, expr) => {
                                    try {
                                        return context[expr] !== undefined ? context[expr] : eval(expr);
                                    } catch {
                                        return `[Error evaluating: ${expr}]`;
                                    }
                                });
                            } else {
                                // Remove quotes if present
                                content = content.replace(/^["'](.*)["']$/, '$1');
                            }
                            result += content + '\n';
                        }
                    } else if (trimmedLine.includes('=')) {
                        // Handle variable assignments
                        const [varName, varValue] = trimmedLine.split('=').map(s => s.trim());
                        try {
                            context[varName] = eval(varValue);
                        } catch {
                            throw new Error(`Failed to evaluate: ${trimmedLine}`);
                        }
                    }
                }
            } catch (error) {
                throw new Error('Code execution failed: ' + error.message);
            }
            
            output.innerHTML = `<pre class="output-content">${result || 'No output'}</pre>`;
        } catch (error) {
            output.innerHTML = `<div class="output-error">Error: ${error.message}</div>`;
        } finally {
            runButton.disabled = false;
            runButton.innerHTML = '<i class="fas fa-play"></i> Run Code';
        }
    });

    // Reset functionality
    resetButton.addEventListener('click', () => {
        codeInput.value = defaultCode;
        updateCode();
        output.innerHTML = '';
    });

    // Show the textarea for editing
    codeInput.style.display = 'block';
    
    // Initial highlight
    updateCode();
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Sticky header with hide/show on scroll
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scrolling down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scrolling up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Code editor functionality
class CodeEditor {
    constructor() {
        this.editor = document.querySelector('.editor-content pre code');
        this.output = document.querySelector('.editor-output pre');
        this.runButton = document.querySelector('.run-btn');
        this.tabs = document.querySelectorAll('.tab');
        
        if (this.runButton) {
            this.runButton.addEventListener('click', () => this.runCode());
        }
        
        if (this.tabs) {
            this.tabs.forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab));
            });
        }
    }

    switchTab(clickedTab) {
        this.tabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
        
        const isOutput = clickedTab.textContent.toLowerCase() === 'output';
        document.querySelector('.editor-content').style.display = isOutput ? 'none' : 'block';
        document.querySelector('.editor-output').style.display = isOutput ? 'block' : 'none';
    }

    async runCode() {
        const code = this.editor.textContent;
        this.runButton.disabled = true;
        this.runButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        
        try {
            // In a real implementation, this would send the code to a backend server
            // For demo purposes, we'll simulate code execution
            await this.simulateCodeExecution(code);
        } catch (error) {
            this.output.textContent = `Error: ${error.message}`;
        } finally {
            this.runButton.disabled = false;
            this.runButton.innerHTML = '<i class="fas fa-play"></i> Run Code';
        }
    }

    async simulateCodeExecution(code) {
        // Simulate server delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simple code evaluation (for demo purposes only)
        try {
            // This is a very basic simulation
            // In a real implementation, code would be executed in a secure backend environment
            const result = this.simulateOutput(code);
            this.output.textContent = result;
        } catch (error) {
            throw new Error('Code execution failed');
        }
    }

    simulateOutput(code) {
        // This is just a simulation - in reality, you would never eval user code in the browser
        if (code.includes('fibonacci')) {
            return '0\n1\n1\n2\n3';
        }
        return 'Hello, Learner! 👋';
    }
}

// Challenge cards interaction
const challengeCards = document.querySelectorAll('.challenge-card');
challengeCards.forEach(card => {
    const button = card.querySelector('.challenge-btn');
    if (button) {
        button.addEventListener('click', () => {
            // In a real implementation, this would load the challenge
            button.textContent = 'Loading...';
            setTimeout(() => {
                button.textContent = 'Start Challenge';
                alert('Challenge environment is being prepared...');
            }, 1000);
        });
    }
});

// Tutorial cards interaction
const tutorialCards = document.querySelectorAll('.tutorial-card');
tutorialCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Window resize handler
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
        const nav = document.querySelector('nav');
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('mobile-menu-open');
            mobileMenuBtn.innerHTML = nav.classList.contains('mobile-menu-open') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        nav.insertBefore(mobileMenuBtn, nav.firstChild);
    } else if (window.innerWidth > 768) {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.remove();
        }
        const nav = document.querySelector('nav');
        nav.classList.remove('mobile-menu-open');
    }
});

// Initialize code editor
const codeEditor = new CodeEditor();

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});
