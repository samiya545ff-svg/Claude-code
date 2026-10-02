"use client";

import { useState } from "react";
import PageHead from "@/components/PageHead";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import { useStore } from "@/lib/store";

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} className={n <= value ? "on" : ""} aria-label={`${n} stars`}>
          <Icon name="star" size={15} />
        </button>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const { state, update, uid } = useStore();
  const [name, setName] = useState(state.people[0]?.name ?? "");
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const avg = state.reviews.length ? state.reviews.reduce((a, r) => a + r.rating, 0) / state.reviews.length : 0;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment.trim()) return;
    const d = new Date();
    update((s) => ({
      ...s,
      reviews: [
        { id: uid(), name, rating, comment: comment.trim(), date: `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}` },
        ...s.reviews,
      ],
    }));
    setComment("");
  };

  return (
    <>
      <PageHead title="Reviews" sub={`Average rating ${avg.toFixed(1)} / 5 from ${state.reviews.length} reviews`} />
      <form className="card form" onSubmit={add}>
        <div className="form-row">
          <label>
            Employee
            <select value={name} onChange={(e) => setName(e.target.value)}>
              {state.people.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label>
            Rating
            <Stars value={rating} onChange={setRating} />
          </label>
        </div>
        <label>
          Feedback
          <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What went well?" />
        </label>
        <div className="form-actions">
          <button className="btn">Add review</button>
        </div>
      </form>
      <div className="review-list">
        {state.reviews.map((r) => (
          <div key={r.id} className="card review">
            <Avatar name={r.name} size={36} />
            <div className="grow">
              <div className="row between">
                <strong>{r.name}</strong>
                <Stars value={r.rating} />
              </div>
              <p>{r.comment}</p>
              <small className="muted">{r.date}</small>
            </div>
            <button className="mini-btn" aria-label="Delete review" onClick={() => update((s) => ({ ...s, reviews: s.reviews.filter((x) => x.id !== r.id) }))}>
              <Icon name="trash" size={13} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
