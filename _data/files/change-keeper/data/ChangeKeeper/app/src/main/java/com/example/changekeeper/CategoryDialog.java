package com.example.changekeeper;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatDialogFragment;
import android.text.Selection;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class CategoryDialog extends AppCompatDialogFragment{
    //Class used to create a new category for incomes/expenses
    private CategoryDialogListener listener;
    private String imageName;
    static CategoryDialog newInstance() {
        return new CategoryDialog();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.layout_category_dialogue, null);
        View ultraView = view;
        EditText edt = (EditText)view.findViewById(R.id.fromInput);
        Selection.setSelection(edt.getText(), edt.getText().length());
        edt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((TextView)ultraView.findViewById(R.id.textView6)).setTextColor(Color.parseColor("#7f8c8d"));
            }
        });

        imageName = "ic_usercat";

        ImageButton b = (ImageButton) view.findViewById(R.id.undefined);
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((ImageButton) ultraView.findViewById(R.id.undefined)).setImageResource(R.drawable.ic_usercat);
                ((ImageButton) ultraView.findViewById(R.id.gym)).setImageResource(R.drawable.ic_gym_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gift)).setImageResource(R.drawable.ic_gift_not_selected);

                ((ImageButton) ultraView.findViewById(R.id.tech)).setImageResource(R.drawable.ic_tech_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.movie)).setImageResource(R.drawable.ic_movie_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.shopping)).setImageResource(R.drawable.ic_shopping_not_selected);

                imageName = "ic_usercat";
            }
        });

        b = (ImageButton) view.findViewById(R.id.gym);
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.i("Tag","lol " +ultraView.findViewById(R.id.undefined).getId());
                ((ImageButton) ultraView.findViewById(R.id.undefined)).setImageResource(R.drawable.ic_usercat_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gym)).setImageResource(R.drawable.ic_gym);
                ((ImageButton) ultraView.findViewById(R.id.gift)).setImageResource(R.drawable.ic_gift_not_selected);

                ((ImageButton) ultraView.findViewById(R.id.tech)).setImageResource(R.drawable.ic_tech_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.movie)).setImageResource(R.drawable.ic_movie_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.shopping)).setImageResource(R.drawable.ic_shopping_not_selected);

                imageName = "ic_gym";
                Log.i("TAG","Clicked GYM");

            }
        });

        b = (ImageButton) view.findViewById(R.id.gift);
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((ImageButton) ultraView.findViewById(R.id.undefined)).setImageResource(R.drawable.ic_usercat_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gym)).setImageResource(R.drawable.ic_gym_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gift)).setImageResource(R.drawable.ic_gift);

                ((ImageButton) ultraView.findViewById(R.id.tech)).setImageResource(R.drawable.ic_tech_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.movie)).setImageResource(R.drawable.ic_movie_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.shopping)).setImageResource(R.drawable.ic_shopping_not_selected);

                imageName = "ic_gift";
            }
        });

        b = (ImageButton) view.findViewById(R.id.tech);
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((ImageButton) ultraView.findViewById(R.id.undefined)).setImageResource(R.drawable.ic_usercat_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gym)).setImageResource(R.drawable.ic_gym_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gift)).setImageResource(R.drawable.ic_gift_not_selected);

                ((ImageButton) ultraView.findViewById(R.id.tech)).setImageResource(R.drawable.ic_tech);
                ((ImageButton) ultraView.findViewById(R.id.movie)).setImageResource(R.drawable.ic_movie_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.shopping)).setImageResource(R.drawable.ic_shopping_not_selected);

                imageName = "ic_tech";
            }
        });

        b = (ImageButton) view.findViewById(R.id.movie);
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((ImageButton) ultraView.findViewById(R.id.undefined)).setImageResource(R.drawable.ic_usercat_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gym)).setImageResource(R.drawable.ic_gym_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gift)).setImageResource(R.drawable.ic_gift_not_selected);

                ((ImageButton) ultraView.findViewById(R.id.tech)).setImageResource(R.drawable.ic_tech_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.movie)).setImageResource(R.drawable.ic_movie);
                ((ImageButton) ultraView.findViewById(R.id.shopping)).setImageResource(R.drawable.ic_shopping_not_selected);

                imageName = "ic_movie";
            }
        });

        b = (ImageButton) view.findViewById(R.id.shopping);
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((ImageButton) ultraView.findViewById(R.id.undefined)).setImageResource(R.drawable.ic_usercat_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gym)).setImageResource(R.drawable.ic_gym_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.gift)).setImageResource(R.drawable.ic_gift_not_selected);

                ((ImageButton) ultraView.findViewById(R.id.tech)).setImageResource(R.drawable.ic_tech_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.movie)).setImageResource(R.drawable.ic_movie_not_selected);
                ((ImageButton) ultraView.findViewById(R.id.shopping)).setImageResource(R.drawable.ic_shopping);

                imageName = "ic_shopping";
            }
        });


        Button butt  = view.findViewById(R.id.conf);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.i("puto","lololo");
                if(((EditText)view.findViewById(R.id.fromInput)).getText().toString().length()==0){
                    Animation shake = AnimationUtils.loadAnimation(getContext(), R.anim.shake);
                    ((TextView)view.findViewById(R.id.textView6)).startAnimation(shake);
                    ((TextView)view.findViewById(R.id.textView6)).setTextColor(Color.parseColor("#c0392b"));

                }else{
                    listener.createCategory(((EditText)ultraView.findViewById(R.id.fromInput)).getText().toString(),imageName);
                    dismiss();
                }
            }
        });

        Button butt2  = view.findViewById(R.id.canc);
        butt2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                listener.cancel();
                dismiss();
            }
        });

        return view;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {

        super.onViewCreated(view, savedInstanceState);
        Log.i("oi","lol:)");
        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (CategoryDialogListener) context;
        } catch (ClassCastException e) {
            throw new ClassCastException((context.toString() + "Did not implement CategoryDialogListener"));
        }
    }

    public interface CategoryDialogListener{
        void createCategory(String name, String imageName);
        void cancel();

    }

}


