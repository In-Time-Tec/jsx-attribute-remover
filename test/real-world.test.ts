import { describe, it, expect } from 'bun:test';
import removeAttributes from '../src/index';
import { transformCode } from '../src/transform';
import { createAttributeMatcher } from '../src/matcher';

describe('Real-world scenarios', () => {
  describe('E-commerce component', () => {
    it('should remove test attributes from product card', () => {
      const matcher = createAttributeMatcher(['data-testid', 'data-cy', /^data-qa-/]);
      const input = `
        function ProductCard({ product }) {
          return (
            <div data-testid="product-card" data-qa-product-id={product.id} className="product-card">
              <img 
                data-testid="product-image"
                src={product.image} 
                alt={product.name}
                className="product-image"
              />
              <h3 data-testid="product-name" className="product-name">
                {product.name}
              </h3>
              <p data-testid="product-price" className="product-price">
                $\{product.price}
              </p>
              <button 
                data-testid="add-to-cart"
                data-cy="add-to-cart-btn"
                data-qa-action="add-to-cart"
                onClick={() => addToCart(product.id)}
                className="btn btn-primary"
              >
                Add to Cart
              </button>
            </div>
          );
        }
      `;
      
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toMatch(/data-testid|data-cy|data-qa-/);
      expect(result.code).toContain('className="product-card"');
      expect(result.code).toContain('onClick={() => addToCart(product.id)}');
    });
  });

  describe('Form component with validation', () => {
    it('should remove test attributes from complex form', () => {
      const matcher = createAttributeMatcher(/^data-test/);
      const input = `
        function LoginForm() {
          const [email, setEmail] = useState('');
          const [password, setPassword] = useState('');
          const [errors, setErrors] = useState({});

          return (
            <form data-test-form="login" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" data-test-label="email">
                  Email
                </label>
                <input
                  data-test-input="email"
                  data-test-error={errors.email ? 'true' : 'false'}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <span data-test-error-message="email" className="error">
                    {errors.email}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" data-test-label="password">
                  Password
                </label>
                <input
                  data-test-input="password"
                  data-test-type="secure"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <button 
                data-test-submit="login"
                data-test-disabled={!email || !password}
                type="submit"
                disabled={!email || !password}
              >
                Log In
              </button>
            </form>
          );
        }
      `;
      
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toMatch(/data-test/);
      expect(result.code).toContain('htmlFor="email"');
      expect(result.code).toContain('type="email"');
      expect(result.code).toContain('disabled={!email || !password}');
    });
  });

  describe('Dashboard with multiple testing frameworks', () => {
    it('should remove attributes from different testing tools', () => {
      const matcher = createAttributeMatcher([
        'data-testid',           // Jest/React Testing Library
        /^data-cy-/,            // Cypress
        /^data-pw-/,            // Playwright
        'data-automation-id',    // Custom automation
        /^qa-/                  // QA attributes
      ]);
      
      const input = `
        function Dashboard({ user, metrics }) {
          return (
            <div data-testid="dashboard" className="dashboard">
              <header data-cy-region="header" className="dashboard-header">
                <h1 data-testid="welcome-message">
                  Welcome, {user.name}
                </h1>
                <button
                  data-cy-button="logout"
                  data-pw-click="logout"
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </button>
              </header>
              
              <main data-automation-id="main-content" className="dashboard-main">
                <section data-testid="metrics-section" qa-section="metrics">
                  <h2>Your Metrics</h2>
                  <div data-pw-metrics="container" className="metrics-grid">
                    {metrics.map((metric) => (
                      <div
                        key={metric.id}
                        data-testid={\`metric-\${metric.id}\`}
                        data-cy-metric={metric.name}
                        qa-value={metric.value}
                        className="metric-card"
                      >
                        <h3>{metric.name}</h3>
                        <p>{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </main>
            </div>
          );
        }
      `;
      
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toMatch(/data-testid|data-cy-|data-pw-|data-automation-id|qa-/);
      expect(result.code).toContain('className="dashboard"');
      expect(result.code).toContain('onClick={handleLogout}');
      expect(result.code).toContain('className="metrics-grid"');
    });
  });

  describe('Component library with accessibility testing', () => {
    it('should selectively remove test attributes while preserving aria', () => {
      const matcher = createAttributeMatcher([
        /^data-test/,
        name => name.startsWith('test-') || name.endsWith('-test')
      ]);
      
      const input = `
        export function Modal({ isOpen, onClose, title, children }) {
          return (
            <div
              data-testid="modal-backdrop"
              className="modal-backdrop"
              onClick={onClose}
              role="presentation"
            >
              <div
                data-testid="modal-content"
                data-test-state={isOpen ? 'open' : 'closed'}
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.stopPropagation()}
              >
                <header className="modal-header">
                  <h2 
                    id="modal-title" 
                    data-test-element="title"
                    test-content={title}
                  >
                    {title}
                  </h2>
                  <button
                    data-testid="close-button"
                    accessibility-test="close"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="close-btn"
                  >
                    ×
                  </button>
                </header>
                <div 
                  data-test-scrollable="true"
                  className="modal-body"
                  role="document"
                >
                  {children}
                </div>
              </div>
            </div>
          );
        }
      `;
      
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toMatch(/data-test|test-content|accessibility-test/);
      expect(result.code).toContain('aria-modal="true"');
      expect(result.code).toContain('aria-labelledby="modal-title"');
      expect(result.code).toContain('aria-label="Close modal"');
      expect(result.code).toContain('role="dialog"');
    });
  });

  describe('Performance monitoring attributes', () => {
    it('should remove performance tracking attributes in production', () => {
      const matcher = createAttributeMatcher([
        /^data-perf-/,
        /^data-track-/,
        'data-analytics-id',
        name => name.includes('-metric-')
      ]);
      
      const input = `
        function VideoPlayer({ src, title }) {
          const videoRef = useRef(null);
          const [isPlaying, setIsPlaying] = useState(false);
          
          return (
            <div 
              data-perf-component="video-player"
              data-track-impression="video-view"
              className="video-player"
            >
              <video
                ref={videoRef}
                data-perf-resource="video"
                data-track-duration={true}
                data-analytics-id={\`video-\${title}\`}
                className="video-element"
                src={src}
                controls
              />
              <div className="video-controls">
                <button
                  data-track-click="play-pause"
                  data-perf-metric-interaction="play"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="play-pause-btn"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <div 
                  data-track-metric-quality="hd"
                  className="quality-selector"
                >
                  <select data-perf-change="quality">
                    <option value="360p">360p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                  </select>
                </div>
              </div>
            </div>
          );
        }
      `;
      
      const result = transformCode(input, matcher);
      
      expect(result.code).not.toMatch(/data-perf-|data-track-|data-analytics-id|-metric-/);
      expect(result.code).toContain('className="video-player"');
      expect(result.code).toContain('controls');
      expect(result.code).toContain('onClick={() => setIsPlaying(!isPlaying)}');
    });
  });
});