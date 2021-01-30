package com.example.changekeeper;

import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatDialogFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

public class FrequencyDialogue extends AppCompatDialogFragment{
    //Class used to create a new category for incomes/expenses
    private FrequencyDialogueListener listener;

    static FrequencyDialogue newInstance() {
        return new FrequencyDialogue();
    }
    private boolean confirmed = false;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.layout_frequencydialogue, null);
        View ultraView = view;

        ((TextView)view.findViewById(R.id.regText)).setText("1");
        Spinner spinner = (Spinner) view.findViewById(R.id.freqPick);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(view.getContext(),
                R.array.frequencies2,R.layout.spinner_item);

        adapter.setDropDownViewResource(R.layout.spinner_item);
        spinner.setAdapter(adapter);
        Button butt  = view.findViewById(R.id.conf);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(((EditText)ultraView.findViewById(R.id.regText)).getText().toString().length()==0){
                    Animation shake = AnimationUtils.loadAnimation(getContext(), R.anim.shake);
                    ((LinearLayout)ultraView.findViewById(R.id.linearLayout4)).startAnimation(shake);
                }else{
                    Log.i("puto","lololo");
                    String frequency = ((TextView)view.findViewById(R.id.regText)).getText().toString();
                    String type = spinner.getSelectedItem().toString();
                    ArrayList<String> days = new ArrayList<>();
                    confirmed = true;
                    listener.updateFrequencies(frequency,type,days);
                    dismiss();
                }

            }
        });

        Button butt2  = view.findViewById(R.id.canc);
        butt2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                listener.noUpdate();
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
            listener = (FrequencyDialogueListener) context;
        } catch (ClassCastException e) {
            throw new ClassCastException((context.toString() + "Did not implement FrequencyDialogueListener"));
        }
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        super.onDismiss(dialog);
        if(!confirmed)
            listener.noUpdate();

    }

    public interface FrequencyDialogueListener{
        void updateFrequencies(String frequency,String type, ArrayList<String> weekdays);
        void noUpdate();

    }

}


