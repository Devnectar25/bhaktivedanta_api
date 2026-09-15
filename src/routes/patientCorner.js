import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

/**
 * Helper to retrieve current patient corner state
 */
async function getCurrentState() {
  const state = readData('patient_corner_state');
  if (state && typeof state === 'object' && Array.isArray(state.guides)) {
    return state;
  }
  return { categories: [], guides: [] };
}

/**
 * Helper to persist full patient corner state
 */
async function saveFullState(state) {
  writeData('patient_corner_state', state);
  return state;
}

// ----------------------------------------------------
// 1. GET FULL PATIENTS CORNER STATE
// Query params supported: ?categoryId=... &status=... &limit=...
// ----------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const state = await getCurrentState();
    const { categoryId, status, limit } = req.query;

    let filteredGuides = state.guides || [];

    if (categoryId) {
      filteredGuides = filteredGuides.filter(g => g.categoryId === categoryId || g.category === categoryId);
    }

    if (status) {
      filteredGuides = filteredGuides.filter(g => 
        String(g.status).toLowerCase() === String(status).toLowerCase()
      );
    }

    if (limit && !isNaN(parseInt(limit, 10))) {
      filteredGuides = filteredGuides.slice(0, parseInt(limit, 10));
    }

    res.json({
      categories: state.categories || [],
      guides: filteredGuides
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 2. PUT FULL PATIENTS CORNER STATE
// ----------------------------------------------------
router.put('/', async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.categories || !payload.guides) {
      return res.status(400).json({ error: 'Payload must contain categories and guides arrays' });
    }

    const updated = await saveFullState({
      categories: Array.isArray(payload.categories) ? payload.categories : [],
      guides: Array.isArray(payload.guides) ? payload.guides : []
    });

    res.json({ success: true, state: updated });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 3. POST CREATE A NEW GUIDE
// Supports POST /guides or POST /
// ----------------------------------------------------
const handleCreateGuide = async (req, res, next) => {
  try {
    const {
      title,
      name,
      categoryId,
      category,
      slug,
      status = 'Published',
      displayOrder,
      order,
      bannerImage = '',
      shortDescription = '',
      tabs = []
    } = req.body;

    const guideTitle = (title || name || '').trim();
    if (!guideTitle) {
      return res.status(400).json({ error: 'Guide title is required' });
    }

    const state = await getCurrentState();
    const cleanSlug = (slug || guideTitle)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const now = new Date().toISOString();
    const newGuide = {
      id: `pc-${Date.now()}`,
      categoryId: categoryId || 'cat-inpatient',
      category: category || 'Inpatient Guide',
      title: guideTitle,
      slug: cleanSlug,
      shortDescription: shortDescription || '',
      bannerImage: bannerImage || '',
      status: status || 'Published',
      displayOrder: parseInt(displayOrder || order, 10) || (state.guides.length + 1),
      adminId: 'ADM-001',
      adminName: 'Super Administrator',
      createdAt: now,
      updatedAt: now,
      tabs: Array.isArray(tabs) ? tabs : []
    };

    state.guides.push(newGuide);
    await saveFullState(state);

    res.status(201).json({ success: true, guide: newGuide });
  } catch (err) {
    next(err);
  }
};

router.post('/guides', handleCreateGuide);
router.post('/', handleCreateGuide);

// ----------------------------------------------------
// 4. GET SINGLE GUIDE BY ID OR SLUG
// Supports GET /guides/:id and GET /:id
// ----------------------------------------------------
const handleGetGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getCurrentState();

    const guide = state.guides.find(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (!guide) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    res.json(guide);
  } catch (err) {
    next(err);
  }
};

router.get('/guides/:id', handleGetGuide);

// ----------------------------------------------------
// 5. PUT UPDATE GUIDE
// Supports PUT /guides/:id
// ----------------------------------------------------
const handleUpdateGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const state = await getCurrentState();

    const index = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const currentGuide = state.guides[index];
    const updatedGuide = {
      ...currentGuide,
      ...updates,
      id: currentGuide.id, // Preserve immutable ID
      updatedAt: new Date().toISOString()
    };

    state.guides[index] = updatedGuide;
    await saveFullState(state);

    res.json({ success: true, guide: updatedGuide });
  } catch (err) {
    next(err);
  }
};

router.put('/guides/:id', handleUpdateGuide);

// ----------------------------------------------------
// 6. DELETE GUIDE
// Supports DELETE /guides/:id
// ----------------------------------------------------
const handleDeleteGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getCurrentState();

    const index = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const removed = state.guides.splice(index, 1)[0];
    await saveFullState(state);

    res.json({ success: true, message: 'Guide deleted successfully', guide: removed });
  } catch (err) {
    next(err);
  }
};

router.delete('/guides/:id', handleDeleteGuide);

// ----------------------------------------------------
// 7. POST ADD A NEW TAB TO A GUIDE
// Supports POST /guides/:id/tabs and POST /:id/tabs
// ----------------------------------------------------
const handleAddTab = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      type = 'rich_text',
      enabled = true,
      content = '',
      steps = [],
      items = [],
      cards = [],
      galleryImages = [],
      faqs = [],
      testimonials = [],
      sections = []
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Tab title is required' });
    }

    const state = await getCurrentState();
    const guideIndex = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (guideIndex === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const guide = state.guides[guideIndex];
    const currentTabs = guide.tabs || [];

    const newTab = {
      id: `tab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      type, // 'rich_text' | 'steps' | 'checklist' | 'list' | 'cards' | 'gallery' | 'faq' | 'testimonials'
      order: currentTabs.length + 1,
      enabled: enabled !== false,
      content: content || '',
      steps: Array.isArray(steps) ? steps : [],
      items: Array.isArray(items) ? items : [],
      cards: Array.isArray(cards) ? cards : [],
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      testimonials: Array.isArray(testimonials) ? testimonials : [],
      sections: Array.isArray(sections) ? sections : []
    };

    guide.tabs = [...currentTabs, newTab];
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.status(201).json({ success: true, tab: newTab, guide });
  } catch (err) {
    next(err);
  }
};

router.post('/guides/:id/tabs', handleAddTab);
router.post('/:id/tabs', handleAddTab);

// ----------------------------------------------------
// 8. PUT REORDER TABS ON A GUIDE
// Supports PUT /guides/:id/tabs/reorder and PUT /:id/tabs/reorder
// ----------------------------------------------------
const handleReorderTabs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tabIds } = req.body;

    if (!Array.isArray(tabIds)) {
      return res.status(400).json({ error: 'tabIds array is required' });
    }

    const state = await getCurrentState();
    const guideIndex = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (guideIndex === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const guide = state.guides[guideIndex];
    const currentTabs = guide.tabs || [];
    const tabMap = new Map(currentTabs.map(t => [t.id, t]));

    const reorderedTabs = tabIds
      .map((tabId, index) => {
        const tab = tabMap.get(tabId);
        if (tab) {
          return { ...tab, order: index + 1 };
        }
        return null;
      })
      .filter(Boolean);

    // Keep any existing tabs that weren't included in the tabIds list
    currentTabs.forEach(tab => {
      if (!tabIds.includes(tab.id)) {
        reorderedTabs.push({ ...tab, order: reorderedTabs.length + 1 });
      }
    });

    guide.tabs = reorderedTabs;
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, tabs: reorderedTabs, guide });
  } catch (err) {
    next(err);
  }
};

router.put('/guides/:id/tabs/reorder', handleReorderTabs);
router.put('/:id/tabs/reorder', handleReorderTabs);

// ----------------------------------------------------
// 9. PUT UPDATE A SPECIFIC TAB
// Supports PUT /guides/:id/tabs/:tabId and PUT /:id/tabs/:tabId
// ----------------------------------------------------
const handleUpdateTab = async (req, res, next) => {
  try {
    const { id, tabId } = req.params;
    const updates = req.body || {};

    const state = await getCurrentState();
    const guideIndex = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (guideIndex === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const guide = state.guides[guideIndex];
    const currentTabs = guide.tabs || [];
    const tabIndex = currentTabs.findIndex(t => t.id === tabId);

    if (tabIndex === -1) {
      return res.status(404).json({ error: 'Tab not found' });
    }

    currentTabs[tabIndex] = {
      ...currentTabs[tabIndex],
      ...updates,
      id: tabId // Preserve original tab id
    };

    guide.tabs = currentTabs;
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, tab: currentTabs[tabIndex], guide });
  } catch (err) {
    next(err);
  }
};

router.put('/guides/:id/tabs/:tabId', handleUpdateTab);
router.put('/:id/tabs/:tabId', handleUpdateTab);

// ----------------------------------------------------
// 10. DELETE A TAB FROM A GUIDE
// Supports DELETE /guides/:id/tabs/:tabId and DELETE /:id/tabs/:tabId
// ----------------------------------------------------
const handleDeleteTab = async (req, res, next) => {
  try {
    const { id, tabId } = req.params;

    const state = await getCurrentState();
    const guideIndex = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (guideIndex === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const guide = state.guides[guideIndex];
    const currentTabs = guide.tabs || [];

    const filteredTabs = currentTabs
      .filter(t => t.id !== tabId)
      .map((t, idx) => ({ ...t, order: idx + 1 }));

    guide.tabs = filteredTabs;
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, tabs: filteredTabs, guide });
  } catch (err) {
    next(err);
  }
};

router.delete('/guides/:id/tabs/:tabId', handleDeleteTab);
router.delete('/:id/tabs/:tabId', handleDeleteTab);

// ----------------------------------------------------
// 11. POST ADD A SECTION TO A TAB
// Supports POST /guides/:id/tabs/:tabId/sections and POST /:id/tabs/:tabId/sections
// ----------------------------------------------------
const handleAddSection = async (req, res, next) => {
  try {
    const { id, tabId } = req.params;
    const {
      title,
      type = 'rich_text',
      enabled = true,
      content = '',
      items = [],
      steps = [],
      cards = [],
      galleryImages = [],
      faqs = [],
      settings = {},
      config = {},
      order
    } = req.body;

    const state = await getCurrentState();
    const guideIndex = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (guideIndex === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const guide = state.guides[guideIndex];
    guide.tabs = guide.tabs || [];
    const tabIndex = guide.tabs.findIndex(t => t.id === tabId);

    if (tabIndex === -1) {
      return res.status(404).json({ error: 'Tab not found' });
    }

    const tab = guide.tabs[tabIndex];
    tab.sections = Array.isArray(tab.sections) ? tab.sections : [];

    const sectionConfig = (typeof settings === 'object' && settings !== null && Object.keys(settings).length > 0)
      ? settings
      : (typeof config === 'object' && config !== null ? config : {});

    const newSection = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: (title || '').trim(),
      type, // 'rich_text' | 'feature_list' | 'accordion' | 'steps' | 'cards' | 'checklist' | 'gallery' | 'faq' | 'table'
      order: parseInt(order, 10) || (tab.sections.length + 1),
      enabled: enabled !== false,
      content: content || '',
      items: Array.isArray(items) ? items : [],
      steps: Array.isArray(steps) ? steps : [],
      cards: Array.isArray(cards) ? cards : [],
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      settings: sectionConfig
    };

    tab.sections.push(newSection);
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.status(201).json({ success: true, section: newSection, guide });
  } catch (err) {
    next(err);
  }
};

router.post('/guides/:id/tabs/:tabId/sections', handleAddSection);
router.post('/:id/tabs/:tabId/sections', handleAddSection);

// ----------------------------------------------------
// 12. PUT REORDER SECTIONS IN A TAB
// Supports PUT /guides/:id/tabs/:tabId/sections/reorder and PUT /:id/tabs/:tabId/sections/reorder
// ----------------------------------------------------
const handleReorderSections = async (req, res, next) => {
  try {
    const { id, tabId } = req.params;
    const { sectionIds } = req.body;

    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({ error: 'sectionIds array is required' });
    }

    const state = await getCurrentState();
    const guideIndex = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (guideIndex === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const guide = state.guides[guideIndex];
    guide.tabs = guide.tabs || [];
    const tabIndex = guide.tabs.findIndex(t => t.id === tabId);

    if (tabIndex === -1) {
      return res.status(404).json({ error: 'Tab not found' });
    }

    const tab = guide.tabs[tabIndex];
    const currentSections = Array.isArray(tab.sections) ? tab.sections : [];
    const sectionMap = new Map(currentSections.map(s => [s.id, s]));

    const reorderedSections = sectionIds
      .map((secId, index) => {
        const sec = sectionMap.get(secId);
        if (sec) {
          return { ...sec, order: index + 1 };
        }
        return null;
      })
      .filter(Boolean);

    // Keep any sections that were omitted in sectionIds list
    currentSections.forEach(sec => {
      if (!sectionIds.includes(sec.id)) {
        reorderedSections.push({ ...sec, order: reorderedSections.length + 1 });
      }
    });

    tab.sections = reorderedSections;
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, sections: reorderedSections, guide });
  } catch (err) {
    next(err);
  }
};

router.put('/guides/:id/tabs/:tabId/sections/reorder', handleReorderSections);
router.put('/:id/tabs/:tabId/sections/reorder', handleReorderSections);

// ----------------------------------------------------
// 13. PUT UPDATE A SPECIFIC SECTION
// Supports PUT /guides/:id/tabs/:tabId/sections/:sectionId and PUT /:id/tabs/:tabId/sections/:sectionId
// ----------------------------------------------------
const handleUpdateSection = async (req, res, next) => {
  try {
    const { id, tabId, sectionId } = req.params;
    const updates = req.body || {};

    const state = await getCurrentState();
    const guideIndex = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (guideIndex === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const guide = state.guides[guideIndex];
    guide.tabs = guide.tabs || [];
    const tabIndex = guide.tabs.findIndex(t => t.id === tabId);

    if (tabIndex === -1) {
      return res.status(404).json({ error: 'Tab not found' });
    }

    const tab = guide.tabs[tabIndex];
    tab.sections = Array.isArray(tab.sections) ? tab.sections : [];
    const secIndex = tab.sections.findIndex(s => s.id === sectionId);

    if (secIndex === -1) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const existingSection = tab.sections[secIndex];
    tab.sections[secIndex] = {
      ...existingSection,
      ...updates,
      id: sectionId, // Preserve original section id
      settings: updates.settings || updates.config || existingSection.settings || {}
    };

    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, section: tab.sections[secIndex], guide });
  } catch (err) {
    next(err);
  }
};

router.put('/guides/:id/tabs/:tabId/sections/:sectionId', handleUpdateSection);
router.put('/:id/tabs/:tabId/sections/:sectionId', handleUpdateSection);

// ----------------------------------------------------
// 14. PATCH TOGGLE / UPDATE SECTION STATUS
// Supports PATCH /guides/:id/tabs/:tabId/sections/:sectionId/status
// ----------------------------------------------------
const handleToggleSectionStatus = async (req, res, next) => {
  try {
    const { id, tabId, sectionId } = req.params;
    const { enabled } = req.body;

    const state = await getCurrentState();
    const guideIndex = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (guideIndex === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const guide = state.guides[guideIndex];
    guide.tabs = guide.tabs || [];
    const tabIndex = guide.tabs.findIndex(t => t.id === tabId);

    if (tabIndex === -1) {
      return res.status(404).json({ error: 'Tab not found' });
    }

    const tab = guide.tabs[tabIndex];
    tab.sections = Array.isArray(tab.sections) ? tab.sections : [];
    const secIndex = tab.sections.findIndex(s => s.id === sectionId);

    if (secIndex === -1) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const currentSection = tab.sections[secIndex];
    currentSection.enabled = typeof enabled === 'boolean' ? enabled : !currentSection.enabled;
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, section: currentSection, guide });
  } catch (err) {
    next(err);
  }
};

router.patch('/guides/:id/tabs/:tabId/sections/:sectionId/status', handleToggleSectionStatus);
router.patch('/:id/tabs/:tabId/sections/:sectionId/status', handleToggleSectionStatus);

// ----------------------------------------------------
// 15. DELETE A SECTION FROM A TAB
// Supports DELETE /guides/:id/tabs/:tabId/sections/:sectionId and DELETE /:id/tabs/:tabId/sections/:sectionId
// ----------------------------------------------------
const handleDeleteSection = async (req, res, next) => {
  try {
    const { id, tabId, sectionId } = req.params;

    const state = await getCurrentState();
    const guideIndex = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (guideIndex === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const guide = state.guides[guideIndex];
    guide.tabs = guide.tabs || [];
    const tabIndex = guide.tabs.findIndex(t => t.id === tabId);

    if (tabIndex === -1) {
      return res.status(404).json({ error: 'Tab not found' });
    }

    const tab = guide.tabs[tabIndex];
    tab.sections = Array.isArray(tab.sections) ? tab.sections : [];

    const filteredSections = tab.sections
      .filter(s => s.id !== sectionId)
      .map((s, idx) => ({ ...s, order: idx + 1 }));

    tab.sections = filteredSections;
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, sections: filteredSections, guide });
  } catch (err) {
    next(err);
  }
};

router.delete('/guides/:id/tabs/:tabId/sections/:sectionId', handleDeleteSection);
router.delete('/:id/tabs/:tabId/sections/:sectionId', handleDeleteSection);

// ----------------------------------------------------
// Fallback root parameters (:id routes)
// ----------------------------------------------------
router.get('/:id', handleGetGuide);
router.put('/:id', handleUpdateGuide);
router.delete('/:id', handleDeleteGuide);

export default router;
