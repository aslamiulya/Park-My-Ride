/**
 * Event Garage Parking — shared portal scripts
 * Header username + mobile sidebar
 */
(function (window) {
  const EGP = window.EGP || {};
  const HOME_OWNERS_API = "https://eventgarageparking.online/api/home-owners/";

  function toDisplayUsername(...candidates) {
    for (const raw of candidates) {
      if (raw == null) continue;
      let name = String(raw).trim();
      if (!name) continue;
      if (name.includes("@")) {
        name = name.split("@")[0].trim();
      }
      if (name) return name;
    }
    return "";
  }

  function updateUserName(name) {
    name = toDisplayUsername(name);
    if (!name) return;

    const desktopUser = document.getElementById("loggedInUserDesktop");
    const mobileUser = document.getElementById("loggedInUserMobile");

    if (desktopUser) {
      desktopUser.textContent = name;
      desktopUser.classList.remove("hidden");
    }

    if (mobileUser) {
      mobileUser.textContent = name;
      mobileUser.classList.remove("hidden");
    }

    const desktopDivider = document.getElementById("desktopUserDivider");
    const mobileDivider = document.getElementById("mobileUserDivider");

    if (desktopDivider) {
      desktopDivider.classList.remove("hidden");
    }

    if (mobileDivider) {
      mobileDivider.classList.remove("hidden");
    }
  }

  function claimsFromJwt(jwt) {
    try {
      const part = String(jwt).split(".")[1];
      if (!part) return null;
      const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function displayNameFromOwner(owner) {
    if (!owner || typeof owner !== "object") return "";
    return toDisplayUsername(
      owner.username,
      owner.user?.username,
      [owner.first_name, owner.last_name].filter(Boolean).join(" "),
      owner.email,
      owner.user?.email
    );
  }

  function getHomeOwnerId() {
    const savedId = localStorage.getItem("pmr_home_owner_id");
    if (savedId) return savedId;

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return (
        user?.host_id ||
        user?.home_owner_id ||
        user?.homeowner_id ||
        user?.id ||
        null
      );
    } catch {
      return null;
    }
  }

  function hostIdFromClaims(token) {
    const claims = claimsFromJwt(token) || {};
    return (
      claims.host_id ||
      claims.home_owner_id ||
      claims.homeowner_id ||
      null
    );
  }

  async function fetchHomeOwnerProfile(token, cachedUsername) {
    if (!token) return null;

    const authHeaders = {
      "X-Auth-Token": token,
      Accept: "application/json"
    };

    const homeOwnerId = getHomeOwnerId() || hostIdFromClaims(token);

    if (homeOwnerId) {
      const response = await fetch(`${HOME_OWNERS_API}${homeOwnerId}/`, {
        method: "GET",
        headers: authHeaders
      });

      if (response.ok) {
        return await response.json();
      }
    }

    const listRes = await fetch(HOME_OWNERS_API, {
      method: "GET",
      headers: authHeaders
    });
    if (!listRes.ok) return null;

    const listData = await listRes.json();
    const owners = Array.isArray(listData)
      ? listData
      : listData?.results || listData?.data || [];

    if (!owners.length) return null;

    let cachedEmail = "";
    try {
      cachedEmail = JSON.parse(localStorage.getItem("user") || "{}")?.email || "";
    } catch {
      cachedEmail = "";
    }

    const username = cachedUsername || "";
    if (!cachedEmail && username.includes("@")) {
      cachedEmail = username;
    }

    const emailLower = String(cachedEmail).toLowerCase();
    return (
      owners.find(
        (o) =>
          String(o?.email || "").toLowerCase() === emailLower ||
          String(o?.username || "").toLowerCase() === emailLower
      ) || owners[0]
    );
  }

  async function initHeaderUser() {
    const token = localStorage.getItem("pmr_token");
    let username = toDisplayUsername(localStorage.getItem("loggedInUser"));

    if (username) {
      updateUserName(username);
    }

    if (!token) return username;

    try {
      const data = await fetchHomeOwnerProfile(token, username);

      if (data) {
        const hostId =
          data.host_id ||
          data.home_owner_id ||
          data.homeowner_id ||
          data.id;
        if (hostId != null) {
          localStorage.setItem("pmr_home_owner_id", String(hostId));
        }
        localStorage.setItem("user", JSON.stringify(data));

        username = displayNameFromOwner(data);
        if (!username) {
          try {
            const cached = JSON.parse(localStorage.getItem("user") || "{}");
            username = toDisplayUsername(cached.email, data.email);
          } catch {
            username = toDisplayUsername(data.email);
          }
        }
        if (username) {
          localStorage.setItem("loggedInUser", username);
          updateUserName(username);
        }
      }
    } catch (error) {
      console.error("User loading error:", error);
    }

    return username;
  }

  function getOverlayElement(overlayId) {
    if (overlayId) {
      return document.getElementById(overlayId);
    }
    return (
      document.getElementById("sidebarOverlay") ||
      document.getElementById("overlay")
    );
  }

  function initSidebar(options = {}) {
    const {
      mobileOnly = false,
      lockBodyScroll = false,
      overlayId = null
    } = options;

    const sidebar = document.getElementById("sidebar");
    const overlay = getOverlayElement(overlayId);
    const openBtn = document.getElementById("openSidebar");
    const closeBtn = document.getElementById("closeSidebar");

    if (!sidebar) return;

    function isMobile() {
      return window.innerWidth < 768;
    }

    function openSidebarMenu() {
      if (mobileOnly && !isMobile()) return;

      sidebar.classList.remove("-translate-x-full");
      if (overlay) overlay.classList.remove("hidden");
      if (lockBodyScroll) {
        document.body.classList.add("overflow-hidden");
      }
    }

    function closeSidebarMenu() {
      if (mobileOnly && !isMobile()) return;

      sidebar.classList.add("-translate-x-full");
      if (overlay) overlay.classList.add("hidden");
      if (lockBodyScroll) {
        document.body.classList.remove("overflow-hidden");
      }
    }

    if (openBtn) {
      openBtn.addEventListener("click", openSidebarMenu);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeSidebarMenu);
    }

    if (overlay) {
      overlay.addEventListener("click", closeSidebarMenu);
    }

    if (mobileOnly) {
      window.addEventListener("resize", () => {
        if (!isMobile()) {
          sidebar.classList.remove("-translate-x-full");
          if (overlay) overlay.classList.add("hidden");
          document.body.classList.remove("overflow-hidden");
        } else {
          sidebar.classList.add("-translate-x-full");
        }
      });
    }
  }

  async function initPortalPage(options = {}) {
    await initHeaderUser();
    initSidebar(options);
  }

  EGP.toDisplayUsername = toDisplayUsername;
  EGP.updateUserName = updateUserName;
  EGP.initHeaderUser = initHeaderUser;
  EGP.initSidebar = initSidebar;
  EGP.initPortalPage = initPortalPage;

  window.EGP = EGP;
})(window);
