const Voucher         = require("../../models/Voucher");
const VendorVoucherRule = require("../../models/VendorVoucherRule");

function randomCode(prefix = "RWD") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function codeUnique(code) {
  const existing = await Voucher.findOne({ code });
  return !existing;
}

async function safeCode(prefix) {
  let code = randomCode(prefix);
  let tries = 0;
  while (!(await codeUnique(code)) && tries < 10) {
    code = randomCode(prefix);
    tries++;
  }
  return code;
}

// Called after isPaid = true — generates reward vouchers per vendor rule
async function generateRewardVouchers(order) {
  try {
    // Gather unique vendor IDs from order items
    const vendorIds = [...new Set(
      order.items
        .map((i) => i.vendor?.toString?.() ?? i.vendor)
        .filter(Boolean)
    )];

    for (const vendorId of vendorIds) {
      const rule = await VendorVoucherRule.findOne({ vendorId, enabled: true });
      if (!rule) continue;

      if (rule.minOrderAmount > 0) {
        const vendorSubtotal = order.items
          .filter((i) => (i.vendor?.toString?.() ?? i.vendor) === vendorId)
          .reduce((s, i) => s + i.price * i.quantity, 0);
        if (vendorSubtotal < rule.minOrderAmount) continue;
      }

      const expires = new Date();
      expires.setDate(expires.getDate() + rule.validDays);

      const code = await safeCode("RWD");

      await Voucher.create({
        code,
        type:          rule.type,
        value:         rule.value,
        minOrder:      0,
        active:        true,
        expiresAt:     expires,
        vendorId,
        productIds:    rule.productIds ?? [],
        scope:         "reward",
        issuedTo:      order.user,
        sourceOrderId: order._id,
        isRedeemed:    false,
      });
    }
  } catch (err) {
    console.error("[voucherRewardService] generateRewardVouchers error:", err.message);
  }
}

// Called on order cancel/refund — deactivates unredeemed reward vouchers from that order
async function invalidateOrderVouchers(orderId) {
  try {
    await Voucher.updateMany(
      { sourceOrderId: orderId, isRedeemed: false },
      { active: false }
    );
  } catch (err) {
    console.error("[voucherRewardService] invalidateOrderVouchers error:", err.message);
  }
}

module.exports = { generateRewardVouchers, invalidateOrderVouchers };
