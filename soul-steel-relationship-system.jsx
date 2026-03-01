import { useState } from "react";

const colors = {
  bg: "#0a0a0f",
  card: "#12121a",
  cardHover: "#1a1a28",
  border: "#2a2a3a",
  accent: "#c43030",
  accentGlow: "#ff4444",
  gold: "#d4a843",
  goldDim: "#8a6f2a",
  blue: "#4a7aaa",
  green: "#3a8a5a",
  purple: "#7a4aaa",
  text: "#e0ddd5",
  textDim: "#8a8880",
  warmth: "#e85050",
  respect: "#50a0e8",
  trust: "#50c878",
  power: "#c080ff",
};

const TraitBar = ({ label, value, max = 10, color = colors.gold }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
    <span style={{ width: 90, fontSize: 11, color: colors.textDim, textAlign: "right" }}>{label}</span>
    <div style={{ flex: 1, height: 8, background: "#1a1a28", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
    </div>
    <span style={{ width: 20, fontSize: 11, color, textAlign: "right", fontWeight: 600 }}>{value}</span>
  </div>
);

const AxisBar = ({ label, value, color, min = -10, max = 10 }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const zeroPct = ((0 - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ width: 60, fontSize: 11, color: colors.textDim, textAlign: "right" }}>{label}</span>
      <div style={{ flex: 1, height: 10, background: "#1a1a28", borderRadius: 5, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: `${zeroPct}%`, top: 0, bottom: 0, width: 1, background: "#444" }} />
        <div style={{
          position: "absolute",
          left: value >= 0 ? `${zeroPct}%` : `${pct}%`,
          width: `${Math.abs(pct - zeroPct)}%`,
          height: "100%",
          background: color,
          borderRadius: 5,
          transition: "all 0.5s ease",
          opacity: 0.8,
        }} />
      </div>
      <span style={{ width: 24, fontSize: 11, color, textAlign: "right", fontWeight: 600 }}>{value > 0 ? "+" : ""}{value}</span>
    </div>
  );
};

const EmotionalTag = ({ tag, intensity = "high" }) => {
  const intensityColors = { high: colors.accentGlow, medium: colors.gold, low: colors.textDim };
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", margin: 2, fontSize: 10, fontWeight: 600,
      color: intensityColors[intensity], border: `1px solid ${intensityColors[intensity]}40`,
      borderRadius: 12, background: `${intensityColors[intensity]}10`, textTransform: "uppercase", letterSpacing: 0.5,
    }}>{tag}</span>
  );
};

const SectionTab = ({ label, active, onClick, icon }) => (
  <button onClick={onClick} style={{
    padding: "10px 18px", background: active ? "#1e1e30" : "transparent",
    border: active ? `1px solid ${colors.accent}60` : "1px solid transparent",
    borderBottom: active ? "none" : `1px solid ${colors.border}`,
    borderRadius: "8px 8px 0 0", color: active ? colors.gold : colors.textDim,
    cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400,
    transition: "all 0.2s", fontFamily: "inherit",
    marginBottom: -1,
  }}>
    {icon} {label}
  </button>
);

const Arrow = ({ from, to, label, color = colors.textDim }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0" }}>
    <span style={{ fontSize: 10, color: colors.textDim }}>{from}</span>
    <div style={{ flex: 1, height: 1, background: color, position: "relative" }}>
      <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", fontSize: 9, color, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ position: "absolute", right: -3, top: -3, fontSize: 10, color }}>▸</span>
    </div>
    <span style={{ fontSize: 10, color: colors.textDim }}>{to}</span>
  </div>
);

export default function SoulSteelRelationshipSystem() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostEvent, setShowPostEvent] = useState(false);

  const knightTraits = { Resilience: 5, Compassion: 6, Pride: 8, Openness: 4, Ambition: 3, Conviction: 9 };
  const masterTraits = { Resilience: 7, Compassion: 7, Pride: 5, Openness: 6, Ambition: 8, Conviction: 5 };

  const knightToMasterPre = { Warmth: 1, Respect: 4, Trust: 2, Power: -2 };
  const masterToKnightPre = { Warmth: 3, Respect: 5, Trust: 1, Power: 3 };
  const knightToMasterPost = { Warmth: -3, Respect: 3, Trust: -3, Power: -5 };
  const masterToKnightPost = { Warmth: 4, Respect: 5, Trust: 0, Power: 5 };
  const knightDeltas = { Warmth: -4, Respect: -1, Trust: -5, Power: -3 };
  const masterDeltas = { Warmth: 1, Respect: 0, Trust: -1, Power: 2 };

  const axisColors = { Warmth: colors.warmth, Respect: colors.respect, Trust: colors.trust, Power: colors.purple };

  const renderOverview = () => (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h2 style={{ color: colors.gold, fontSize: 18, margin: 0 }}>Three-Layer Architecture</h2>
        <p style={{ color: colors.textDim, fontSize: 12, margin: "6px 0 0" }}>
          Static identity → Living relationships → Narrative memory
        </p>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {[
          {
            title: "Layer 1: Character Foundation",
            subtitle: "Static / Near-Static",
            color: colors.gold,
            items: ["6 Personality Traits (1–10 scale)", "Name, Title, Domain, Faction", "Core Values & Beliefs", "Disposition Overrides"],
            desc: "Who a character is — set at creation, never changed by events. Acts as the interpretive lens for how events land emotionally.",
          },
          {
            title: "Layer 2: Relationship State",
            subtitle: "Cumulative, Mutable",
            color: colors.blue,
            items: ["4 Relational Axes (-10 to +10)", "Bidirectional (A→B ≠ B→A)", "Seeded from Faction Defaults", "No Decay — Net Accumulation"],
            desc: "How Character A feels about Character B right now. Modified by every significant event. Read in combination by the LLM.",
          },
          {
            title: "Layer 3: Event Log",
            subtitle: "Append-Only",
            color: colors.green,
            items: ["Event ID & Timestamp", "Character Perspective", "Axis Changes Applied", "Emotional Tags"],
            desc: "Narrative memory preserving why the numbers look the way they do. The texture behind the data.",
          },
        ].map((layer, i) => (
          <div key={i} style={{
            flex: 1, background: colors.card, border: `1px solid ${layer.color}30`,
            borderRadius: 10, padding: 16, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${layer.color}, transparent)` }} />
            <div style={{ fontSize: 9, color: layer.color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{layer.subtitle}</div>
            <h3 style={{ color: colors.text, fontSize: 14, margin: "0 0 8px" }}>{layer.title}</h3>
            <p style={{ color: colors.textDim, fontSize: 11, lineHeight: 1.5, margin: "0 0 12px" }}>{layer.desc}</p>
            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 10 }}>
              {layer.items.map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{ color: layer.color, fontSize: 8 }}>◆</span>
                  <span style={{ fontSize: 11, color: colors.text }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ margin: "24px 0 0", padding: 16, background: colors.card, borderRadius: 10, border: `1px solid ${colors.border}` }}>
        <h3 style={{ color: colors.gold, fontSize: 14, margin: "0 0 12px" }}>Data Flow</h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Faction Defaults", color: colors.purple },
            { label: "→", color: colors.textDim, isSep: true },
            { label: "Character Foundation", color: colors.gold },
            { label: "→", color: colors.textDim, isSep: true },
            { label: "Initial Relationship", color: colors.blue },
            { label: "→", color: colors.textDim, isSep: true },
            { label: "LLM Event Generator", color: colors.accent },
            { label: "→", color: colors.textDim, isSep: true },
            { label: "Event Evaluation", color: colors.green },
            { label: "→", color: colors.textDim, isSep: true },
            { label: "Updated State + Log", color: colors.blue },
          ].map((step, i) =>
            step.isSep ? (
              <span key={i} style={{ color: step.color, fontSize: 16 }}>{step.label}</span>
            ) : (
              <span key={i} style={{
                padding: "4px 10px", background: `${step.color}15`, border: `1px solid ${step.color}40`,
                borderRadius: 6, fontSize: 11, color: step.color, fontWeight: 500,
              }}>{step.label}</span>
            )
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ background: colors.card, borderRadius: 10, padding: 16, border: `1px solid ${colors.border}` }}>
          <h3 style={{ color: colors.gold, fontSize: 13, margin: "0 0 10px" }}>Personality Traits (Layer 1)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11 }}>
            {[
              { trait: "Resilience", basis: "Low Neuroticism", role: "Emotional stability under adversity" },
              { trait: "Compassion", basis: "Agreeableness", role: "Default warmth vs. self-interest" },
              { trait: "Pride", basis: "Inv. Agreeableness", role: "Status sensitivity; amplifies slights" },
              { trait: "Openness", basis: "Openness to Exp.", role: "Willingness to revise judgments" },
              { trait: "Ambition", basis: "Extraversion + Agency", role: "Goal-oriented event filtering" },
              { trait: "Conviction", basis: "Conscientiousness", role: "Moral framework rigidity" },
            ].map((t, i) => (
              <div key={i} style={{ padding: 6, background: "#0e0e16", borderRadius: 6 }}>
                <div style={{ color: colors.gold, fontWeight: 600, fontSize: 11 }}>{t.trait}</div>
                <div style={{ color: colors.textDim, fontSize: 9 }}>{t.basis}</div>
                <div style={{ color: colors.text, fontSize: 10, marginTop: 2 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: colors.card, borderRadius: 10, padding: 16, border: `1px solid ${colors.border}` }}>
          <h3 style={{ color: colors.blue, fontSize: 13, margin: "0 0 10px" }}>Relational Axes (Layer 2)</h3>
          {[
            { axis: "Warmth", neg: '"I want you to suffer"', pos: '"I care deeply about you"', color: colors.warmth },
            { axis: "Respect", neg: '"You are beneath me"', pos: '"I take you seriously"', color: colors.respect },
            { axis: "Trust", neg: '"I expect betrayal"', pos: '"I believe in your loyalty"', color: colors.trust },
            { axis: "Power", neg: '"You hold power over me"', pos: '"I hold power over you"', color: colors.power },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 10 }}>
              <span style={{ width: 55, color: a.color, fontWeight: 600 }}>{a.axis}</span>
              <span style={{ color: "#884444", fontSize: 9, width: 90, textAlign: "right" }}>-10 {a.neg}</span>
              <div style={{ flex: 1, height: 4, background: `linear-gradient(90deg, #442222, #222222, ${a.color}60)`, borderRadius: 2 }} />
              <span style={{ color: a.color, fontSize: 9, width: 100 }}>{a.pos} +10</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: 8, background: "#0e0e16", borderRadius: 6 }}>
            <div style={{ color: colors.textDim, fontSize: 10, fontStyle: "italic" }}>
              Combinatorial reading examples:
            </div>
            <div style={{ fontSize: 10, color: colors.text, marginTop: 4 }}>
              <span style={{ color: colors.warmth }}>Warmth +7</span> + <span style={{ color: colors.respect }}>Respect -3</span> = Patronizing affection
            </div>
            <div style={{ fontSize: 10, color: colors.text, marginTop: 2 }}>
              <span style={{ color: colors.warmth }}>Warmth -6</span> + <span style={{ color: colors.respect }}>Respect +8</span> = Feared rival
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCharacters = () => (
    <div style={{ padding: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          {
            name: "The Penitent Knight",
            domain: "Blood Domain",
            faction: "Crimson Order",
            color: colors.accent,
            traits: knightTraits,
            values: ["Honor above all", "Duty to the Order", "Redemption through sacrifice"],
            epithet: "Blade of Contrition",
          },
          {
            name: "The Fateless Master",
            domain: "Fateless",
            faction: "Unaligned",
            color: colors.purple,
            traits: masterTraits,
            values: ["Pragmatic necessity", "The greater outcome", "Freedom from dogma"],
            epithet: "The Unchained",
          },
        ].map((char, i) => (
          <div key={i} style={{
            background: colors.card, borderRadius: 12, overflow: "hidden",
            border: `1px solid ${char.color}30`,
          }}>
            <div style={{
              padding: "14px 16px", background: `linear-gradient(135deg, ${char.color}20, transparent)`,
              borderBottom: `1px solid ${colors.border}`,
            }}>
              <div style={{ fontSize: 9, color: char.color, textTransform: "uppercase", letterSpacing: 1.5 }}>
                {char.domain} — {char.faction}
              </div>
              <h3 style={{ color: colors.text, margin: "4px 0 0", fontSize: 16 }}>{char.name}</h3>
              <div style={{ color: colors.textDim, fontSize: 11, fontStyle: "italic" }}>{char.epithet}</div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 10, color: colors.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Foundation Traits</div>
              {Object.entries(char.traits).map(([trait, val]) => (
                <TraitBar key={trait} label={trait} value={val} color={char.color} />
              ))}
              <div style={{ marginTop: 12, fontSize: 10, color: colors.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Core Values</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {char.values.map((v, j) => (
                  <span key={j} style={{
                    padding: "2px 8px", fontSize: 10, color: char.color, background: `${char.color}10`,
                    border: `1px solid ${char.color}25`, borderRadius: 10,
                  }}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRelationships = () => {
    const kToM = showPostEvent ? knightToMasterPost : knightToMasterPre;
    const mToK = showPostEvent ? masterToKnightPost : masterToKnightPre;

    return (
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <button onClick={() => setShowPostEvent(!showPostEvent)} style={{
            padding: "8px 20px", background: showPostEvent ? `${colors.accent}30` : `${colors.gold}20`,
            border: `1px solid ${showPostEvent ? colors.accent : colors.gold}60`,
            borderRadius: 8, color: showPostEvent ? colors.accentGlow : colors.gold,
            cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            transition: "all 0.3s",
          }}>
            {showPostEvent ? "⚔ After Imprisonment" : "◈ Before Imprisonment"}
            <span style={{ fontSize: 10, marginLeft: 8, opacity: 0.7 }}>(click to toggle)</span>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: colors.card, borderRadius: 12, padding: 16, border: `1px solid ${colors.accent}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ color: colors.accent, fontWeight: 600, fontSize: 13 }}>Knight</span>
              <span style={{ color: colors.textDim }}>→</span>
              <span style={{ color: colors.purple, fontWeight: 600, fontSize: 13 }}>Master</span>
            </div>
            {Object.entries(kToM).map(([axis, val]) => (
              <AxisBar key={axis} label={axis} value={val} color={axisColors[axis]} />
            ))}
            {showPostEvent && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 6 }}>Axis Changes Applied:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(knightDeltas).map(([axis, val]) => (
                    <span key={axis} style={{
                      fontSize: 11, color: val < 0 ? colors.accentGlow : colors.green, fontWeight: 600,
                    }}>
                      {axis}: {val > 0 ? "+" : ""}{val}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 8, fontSize: 10, color: colors.textDim }}>Emotional Tags:</div>
                <div style={{ marginTop: 4 }}>
                  <EmotionalTag tag="fury" intensity="high" />
                  <EmotionalTag tag="humiliation" intensity="high" />
                  <EmotionalTag tag="betrayal" intensity="high" />
                </div>
                <div style={{
                  marginTop: 10, padding: 10, background: "#0e0e16", borderRadius: 8,
                  borderLeft: `2px solid ${colors.accent}`,
                }}>
                  <div style={{ fontSize: 9, color: colors.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Perspective</div>
                  <div style={{ fontSize: 11, color: colors.text, fontStyle: "italic", lineHeight: 1.5 }}>
                    "The Knight sees this as a profound betrayal of trust — an ally who chose expedience over honor."
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: colors.card, borderRadius: 12, padding: 16, border: `1px solid ${colors.purple}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ color: colors.purple, fontWeight: 600, fontSize: 13 }}>Master</span>
              <span style={{ color: colors.textDim }}>→</span>
              <span style={{ color: colors.accent, fontWeight: 600, fontSize: 13 }}>Knight</span>
            </div>
            {Object.entries(mToK).map(([axis, val]) => (
              <AxisBar key={axis} label={axis} value={val} color={axisColors[axis]} />
            ))}
            {showPostEvent && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 6 }}>Axis Changes Applied:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(masterDeltas).map(([axis, val]) => (
                    <span key={axis} style={{
                      fontSize: 11, color: val < 0 ? colors.accentGlow : val > 0 ? colors.green : colors.textDim, fontWeight: 600,
                    }}>
                      {axis}: {val > 0 ? "+" : ""}{val}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 8, fontSize: 10, color: colors.textDim }}>Emotional Tags:</div>
                <div style={{ marginTop: 4 }}>
                  <EmotionalTag tag="guilt" intensity="medium" />
                  <EmotionalTag tag="pity" intensity="medium" />
                  <EmotionalTag tag="resolve" intensity="medium" />
                </div>
                <div style={{
                  marginTop: 10, padding: 10, background: "#0e0e16", borderRadius: 8,
                  borderLeft: `2px solid ${colors.purple}`,
                }}>
                  <div style={{ fontSize: 9, color: colors.purple, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Perspective</div>
                  <div style={{ fontSize: 11, color: colors.text, fontStyle: "italic", lineHeight: 1.5 }}>
                    "The Master believes this was necessary and feels sorrow for the Knight's suffering, but not regret for the decision."
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFactions = () => (
    <div style={{ padding: 20 }}>
      <h3 style={{ color: colors.gold, fontSize: 15, margin: "0 0 16px" }}>Faction Default Cascading</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        {[
          {
            tier: "Allied Factions",
            color: colors.green,
            defaults: { Warmth: 3, Respect: 2, Trust: 3, Power: 0 },
            example: "Blood ↔ Iron",
          },
          {
            tier: "Neutral Factions",
            color: colors.gold,
            defaults: { Warmth: 0, Respect: 0, Trust: 0, Power: 0 },
            example: "Blood ↔ Spirit",
          },
          {
            tier: "Enemy Factions",
            color: colors.accent,
            defaults: { Warmth: -3, Respect: -1, Trust: -4, Power: 0 },
            example: "Blood ↔ Decay",
          },
        ].map((tier, i) => (
          <div key={i} style={{
            background: colors.card, borderRadius: 10, padding: 14,
            border: `1px solid ${tier.color}30`,
          }}>
            <div style={{ color: tier.color, fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{tier.tier}</div>
            <div style={{ color: colors.textDim, fontSize: 10, marginBottom: 10 }}>e.g. {tier.example}</div>
            {Object.entries(tier.defaults).map(([axis, val]) => (
              <AxisBar key={axis} label={axis} value={val} color={axisColors[axis]} />
            ))}
          </div>
        ))}
      </div>

      <div style={{ background: colors.card, borderRadius: 10, padding: 16, border: `1px solid ${colors.border}` }}>
        <h4 style={{ color: colors.blue, fontSize: 13, margin: "0 0 12px" }}>Cascading Process</h4>
        <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
          {[
            { step: "1", title: "Faction Defaults", desc: "Allies/enemies fields map to default axis values for any character pair across those factions.", color: colors.purple },
            { step: "2", title: "Disposition Overrides", desc: "Character-level overrides modify defaults. E.g., a sympathetic Crimson Order member gets warmth +3 toward Spirit characters.", color: colors.gold },
            { step: "3", title: "Event History", desc: "Once personal events modify values, faction defaults become historical — they set the origin point only.", color: colors.green },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, position: "relative" }}>
              <div style={{
                background: `${s.color}10`, border: `1px solid ${s.color}30`, borderRadius: 8, padding: 12,
                height: "100%", boxSizing: "border-box",
              }}>
                <div style={{
                  position: "absolute", top: -8, left: 12, width: 20, height: 20,
                  background: s.color, borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#000",
                }}>{s.step}</div>
                <div style={{ marginTop: 8, color: s.color, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{s.title}</div>
                <div style={{ color: colors.textDim, fontSize: 11, lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEventFlow = () => (
    <div style={{ padding: 20 }}>
      <h3 style={{ color: colors.gold, fontSize: 15, margin: "0 0 4px" }}>LLM Event Generator Interface</h3>
      <p style={{ color: colors.textDim, fontSize: 11, margin: "0 0 16px" }}>How the event generator reads from and writes to the relationship system</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, background: colors.card, borderRadius: 10, padding: 14, border: `1px solid ${colors.blue}30` }}>
          <div style={{ color: colors.blue, fontWeight: 600, fontSize: 12, marginBottom: 8 }}>Input Context (Reads)</div>
          {["All character foundations (traits, values)", "Current relationship states (all axes)", "Full significant event logs", "Faction relationship defaults", "Master timeline / current epoch"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: colors.blue, fontSize: 8 }}>▸</span>
              <span style={{ fontSize: 11, color: colors.text }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 8px" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${colors.accent}20`, border: `2px solid ${colors.accent}50`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
          </div>
          <span style={{ fontSize: 9, color: colors.accent, textTransform: "uppercase", letterSpacing: 1 }}>LLM</span>
        </div>

        <div style={{ flex: 1, background: colors.card, borderRadius: 10, padding: 14, border: `1px solid ${colors.green}30` }}>
          <div style={{ color: colors.green, fontWeight: 600, fontSize: 12, marginBottom: 8 }}>Structured Output (Writes)</div>
          {["Narrative event description", "Per-character axis modifications", "Per-character emotional tags", "Per-character perspective notes", "Significance determination"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: colors.green, fontSize: 8 }}>▸</span>
              <span style={{ fontSize: 11, color: colors.text }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: colors.card, borderRadius: 10, padding: 16, border: `1px solid ${colors.border}` }}>
        <h4 style={{ color: colors.gold, fontSize: 13, margin: "0 0 12px" }}>Modification Guidelines</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { level: "Minor Events", range: "±1–3", color: colors.green, examples: ["Brief conversation", "Observed behavior", "Small favor or slight"] },
            { level: "Major Events", range: "±4–6", color: colors.gold, examples: ["Betrayal or rescue", "Public humiliation", "Sacrifice for another"] },
            { level: "Extreme Events", range: "±7+", color: colors.accentGlow, examples: ["Soul-binding oath broken", "Saving a life at great cost", "World-altering personal loss"] },
          ].map((g, i) => (
            <div key={i} style={{ padding: 12, background: "#0e0e16", borderRadius: 8, borderTop: `2px solid ${g.color}` }}>
              <div style={{ color: g.color, fontWeight: 700, fontSize: 13 }}>{g.level}</div>
              <div style={{ color: g.color, fontSize: 18, fontWeight: 700, margin: "4px 0" }}>{g.range}</div>
              <div style={{ fontSize: 10, color: colors.textDim }}>points per axis</div>
              <div style={{ marginTop: 8 }}>
                {g.examples.map((ex, j) => (
                  <div key={j} style={{ fontSize: 10, color: colors.text, marginBottom: 2 }}>• {ex}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, background: colors.card, borderRadius: 10, padding: 16, border: `1px solid ${colors.border}` }}>
        <h4 style={{ color: colors.gold, fontSize: 13, margin: "0 0 8px" }}>How Traits Modulate Event Impact</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
          {[
            { trait: "High Pride", effect: "Amplifies perceived slights → larger negative warmth/respect shifts", color: colors.accent },
            { trait: "Low Resilience", effect: "Events hit harder overall → larger magnitude changes across all axes", color: colors.warmth },
            { trait: "Low Openness", effect: "Locks in changes longer → slower recovery in future events", color: colors.trust },
            { trait: "High Conviction", effect: "Judges through ethical lens → events that violate values cause extreme reactions", color: colors.gold },
            { trait: "High Compassion", effect: "Guilt responses to causing harm → can increase warmth when hurting others", color: colors.green },
            { trait: "High Ambition", effect: "Filters events through goal relevance → stronger reactions to strategic impacts", color: colors.purple },
          ].map((m, i) => (
            <div key={i} style={{ padding: 8, background: "#0e0e16", borderRadius: 6, display: "flex", gap: 8 }}>
              <span style={{ color: m.color, fontWeight: 600, whiteSpace: "nowrap", minWidth: 100 }}>{m.trait}</span>
              <span style={{ color: colors.textDim }}>{m.effect}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeliverables = () => (
    <div style={{ padding: 20 }}>
      <h3 style={{ color: colors.gold, fontSize: 15, margin: "0 0 16px" }}>Planned Deliverables & Repo Structure</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          {
            file: "characters/_template.yaml",
            desc: "YAML template covering all Layer 1 fields plus empty relationship map structure",
            color: colors.gold,
            icon: "📄",
          },
          {
            file: "characters/_example-penitent-knight.yaml",
            desc: "Fully filled character with pre/post-imprisonment relationship states and event log",
            color: colors.accent,
            icon: "⚔",
          },
          {
            file: "characters/_example-fateless-master.yaml",
            desc: "Counterpart example showing bidirectional relationship tracking",
            color: colors.purple,
            icon: "🔮",
          },
          {
            file: "systems/relationship-system.md",
            desc: "Full system design: three layers, trait definitions, axis semantics, cascading rules, worked examples",
            color: colors.blue,
            icon: "📘",
          },
          {
            file: "systems/event-generator-interface.md",
            desc: "LLM-facing docs: input context, output schemas, calibration guidelines, worked examples",
            color: colors.green,
            icon: "🤖",
          },
          {
            file: "systems/faction-defaults.yaml",
            desc: "Faction-pair default axis values with override documentation",
            color: colors.gold,
            icon: "⚙",
          },
        ].map((d, i) => (
          <div key={i} style={{
            background: colors.card, borderRadius: 10, padding: 14,
            border: `1px solid ${d.color}30`, display: "flex", gap: 10,
          }}>
            <span style={{ fontSize: 22 }}>{d.icon}</span>
            <div>
              <div style={{ color: d.color, fontWeight: 600, fontSize: 12, fontFamily: "monospace" }}>{d.file}</div>
              <div style={{ color: colors.textDim, fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>{d.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: colors.card, borderRadius: 10, padding: 16, border: `1px solid ${colors.border}` }}>
        <h4 style={{ color: colors.textDim, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>Repo Integration Points</h4>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: colors.text, lineHeight: 2, background: "#0a0a0f", padding: 12, borderRadius: 8 }}>
          <div><span style={{ color: colors.textDim }}>├──</span> <span style={{ color: colors.gold }}>overview.md</span> <span style={{ color: colors.textDim, fontSize: 9 }}>← cosmological foundations</span></div>
          <div><span style={{ color: colors.textDim }}>├──</span> <span style={{ color: colors.blue }}>domains/</span> <span style={{ color: colors.textDim, fontSize: 9 }}>← YAML data & lore per domain</span></div>
          <div><span style={{ color: colors.textDim }}>├──</span> <span style={{ color: colors.purple }}>factions/</span> <span style={{ color: colors.textDim, fontSize: 9 }}>← allies/enemies → seeds faction defaults</span></div>
          <div><span style={{ color: colors.textDim }}>├──</span> <span style={{ color: colors.green }}>timeline/</span> <span style={{ color: colors.textDim, fontSize: 9 }}>← event structures → event_id references</span></div>
          <div><span style={{ color: colors.textDim }}>├──</span> <span style={{ color: colors.accent }}>characters/</span> <span style={{ color: colors.textDim, fontSize: 9 }}>← NEW: templates + character files</span></div>
          <div><span style={{ color: colors.textDim }}>│   ├──</span> <span style={{ color: colors.gold }}>_template.yaml</span></div>
          <div><span style={{ color: colors.textDim }}>│   ├──</span> _example-penitent-knight.yaml</div>
          <div><span style={{ color: colors.textDim }}>│   └──</span> _example-fateless-master.yaml</div>
          <div><span style={{ color: colors.textDim }}>└──</span> <span style={{ color: colors.blue }}>systems/</span> <span style={{ color: colors.textDim, fontSize: 9 }}>← NEW: system design docs</span></div>
          <div><span style={{ color: colors.textDim }}>    ├──</span> relationship-system.md</div>
          <div><span style={{ color: colors.textDim }}>    ├──</span> event-generator-interface.md</div>
          <div><span style={{ color: colors.textDim }}>    └──</span> faction-defaults.yaml</div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", label: "System Overview", icon: "◈" },
    { id: "characters", label: "Characters", icon: "⚔" },
    { id: "relationships", label: "Relationships", icon: "↔" },
    { id: "factions", label: "Faction Defaults", icon: "⚙" },
    { id: "eventflow", label: "Event Flow", icon: "⚡" },
    { id: "deliverables", label: "Deliverables", icon: "📁" },
  ];

  return (
    <div style={{
      background: colors.bg, color: colors.text, fontFamily: "'Segoe UI', system-ui, sans-serif",
      minHeight: "100vh", padding: 20,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 300, color: colors.gold, margin: 0,
            letterSpacing: 4, textTransform: "uppercase",
          }}>Soul Steel</h1>
          <div style={{
            fontSize: 13, color: colors.textDim, letterSpacing: 2, marginTop: 4,
          }}>Character & Relationship System</div>
          <div style={{
            width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
            margin: "12px auto 0",
          }} />
        </div>

        <div style={{ display: "flex", gap: 2, borderBottom: `1px solid ${colors.border}`, marginBottom: 0 }}>
          {tabs.map(tab => (
            <SectionTab key={tab.id} label={tab.label} icon={tab.icon}
              active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
          ))}
        </div>

        <div style={{
          background: "#1e1e30", border: `1px solid ${colors.border}`,
          borderTop: "none", borderRadius: "0 0 12px 12px", minHeight: 400,
        }}>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "characters" && renderCharacters()}
          {activeTab === "relationships" && renderRelationships()}
          {activeTab === "factions" && renderFactions()}
          {activeTab === "eventflow" && renderEventFlow()}
          {activeTab === "deliverables" && renderDeliverables()}
        </div>
      </div>
    </div>
  );
}