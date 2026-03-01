import type { Receipt } from "@/lib/mockData";

interface ReceiptTicketProps {
  receipt: Receipt;
  full?: boolean;
}

export default function ReceiptTicket({ receipt, full }: ReceiptTicketProps) {
  return (
    <div className="holo-receipt rounded-t-3xl relative pb-6 shadow-deep">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-dashed border-purple-300/30">
        <p className="text-center text-xs text-muted-foreground font-outfit tracking-widest uppercase">
          {receipt.store}
        </p>
        <p className="text-center text-2xl font-bold font-outfit text-foreground mt-1">
          ${receipt.total.toFixed(2)}
        </p>
        <p className="text-center text-xs text-muted-foreground font-outfit mt-1">
          {new Date(receipt.date + "T12:00:00").toLocaleDateString("en-CA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Items */}
      <div className="px-6 py-4 space-y-2">
        {(full ? receipt.items : receipt.items.slice(0, 5)).map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm font-outfit text-foreground">
              {item.quantity > 1 && `${item.quantity}x `}
              {item.name}
            </span>
            <span className="text-sm font-outfit font-medium text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        {!full && receipt.items.length > 5 && (
          <p className="text-xs text-muted-foreground text-center pt-1">
            +{receipt.items.length - 5} more items
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="px-6 pt-3 border-t border-dashed border-purple-300/30">
        <div className="flex justify-between items-center">
          <span className="text-sm font-outfit text-success font-medium">You Saved</span>
          <span className="text-sm font-outfit font-bold text-success">
            ${receipt.savings.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm font-outfit text-primary font-medium">Points Earned</span>
          <span className="text-sm font-outfit font-bold text-primary">
            +{receipt.pointsEarned}
          </span>
        </div>
      </div>

      {/* Zigzag bottom */}
      <div
        className="absolute -bottom-[10px] left-0 right-0 h-[10px]"
        style={{
          background: `linear-gradient(-45deg, transparent 33.33%, rgba(245,240,255,0.30) 33.33%, rgba(245,240,255,0.30) 66.66%, transparent 66.66%),
                       linear-gradient(45deg, transparent 33.33%, rgba(245,240,255,0.30) 33.33%, rgba(245,240,255,0.30) 66.66%, transparent 66.66%)`,
          backgroundSize: "16px 20px",
          backgroundPosition: "0 -10px",
        }}
      />
    </div>
  );
}
