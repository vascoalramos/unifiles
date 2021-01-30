package com.example.changekeeper;

import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatDialogFragment;
import android.text.Editable;
import android.text.Selection;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class SetWallet extends AppCompatDialogFragment implements ConfirmDialogueSet.ConfirmDialogueSetListener{
    //Class used to create a new category for incomes/expenses
    private SetWalletListener listener;

    static SetWallet newInstance() {
        return new SetWallet();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.layout_set_wallet_dialog, null);
        EditText editAmount = view.findViewById(R.id.fromInput);
        Selection.setSelection(editAmount.getText(), editAmount.getText().length());
        editAmount.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                editAmount.setText("");
            }
        });

        editAmount.addTextChangedListener(new TextWatcher() {
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count,
                                          int after) {
            }

            @Override
            public void afterTextChanged(Editable s) {

                if(!editAmount.getText().toString().endsWith("€")){

                    editAmount.setText(editAmount.getText().toString()+"€");
                    Selection.setSelection(editAmount.getText(), editAmount.getText().length()-1);
                    ((TextView)view.findViewById(R.id.textView4)).setTextColor(Color.parseColor("#7f8c8d"));
                }

            }
        });

        Button butt  = view.findViewById(R.id.conf);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.i("puto","lololo");
                String amount = editAmount.getText().toString();
                if (!amount.matches(".*\\d.*")){
                    ((TextView)view.findViewById(R.id.textView4)).setTextColor(Color.parseColor("#c0392b"));
                    Animation shake = AnimationUtils.loadAnimation(view.getContext(), R.anim.shake);

                    ((TextView)view.findViewById(R.id.textView4)).startAnimation(shake);
                }else{
                    amount.replace("€","");

                    Bundle args = new Bundle();

                    args.putString("amount",amount.replace("€",""));
                    ConfirmDialogueSet confirmDialogue = new ConfirmDialogueSet();
                    confirmDialogue.setArguments(args);
                    confirmDialogue.show(getActivity().getSupportFragmentManager(), "Confirm Dialogue2");

                    dismiss();
                }

            }
        });

        Button butt2  = view.findViewById(R.id.canc);
        butt2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
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
            listener = (SetWalletListener) context;
        } catch (ClassCastException e) {
            throw new ClassCastException((context.toString() + "Did not implement FrequencyDialogueListener"));
        }
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        super.onDismiss(dialog);

    }


    @Override
    public void confirm1(String amount) {

    }

    public interface SetWalletListener{
        void updateTransfer(String value);

    }

}


